import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

const db = await PGlite.create();
const sql = await readdir('supabase/migrations');
const learner = 'f0000000-0000-4000-8000-000000000001';
const evaluator = 'f0000000-0000-4000-8000-000000000002';
const assessment = 'capstone-a5-lumina';
try {
  // Minimal Supabase-managed schemas with a test-only identity context.
  await db.exec(`
    CREATE ROLE anon NOLOGIN;
    CREATE ROLE authenticated NOLOGIN;
    CREATE SCHEMA auth;
    CREATE SCHEMA storage;
    CREATE TABLE auth.users (
      id uuid primary key, email text, raw_user_meta_data jsonb, raw_app_meta_data jsonb
    );
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
      SELECT nullif(current_setting('academy.fixture.user_id', true), '')::uuid
    $$;
    CREATE TABLE storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
    CREATE TABLE storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
    CREATE FUNCTION storage.foldername(name text) RETURNS text[] LANGUAGE sql IMMUTABLE AS $$
      SELECT string_to_array(name, '/')
    $$;
    GRANT USAGE ON SCHEMA auth TO authenticated;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
  `);
  for (const name of sql.filter(name => name.endsWith('.sql')).sort()) {
    await db.exec(await readFile(`supabase/migrations/${name}`, 'utf8'));
    console.log('Migration OK', name);
  }

  const catalog = await db.query('SELECT (SELECT count(*) FROM modules)::int AS modules, (SELECT count(*) FROM lessons)::int AS lessons');
  assert.deepEqual(catalog.rows[0], { modules: 22, lessons: 66 });
  const { rows: seeded } = await db.query('SELECT id, module_id, track_id FROM lessons ORDER BY id');
  const expected = [];
  for (const track of ['designer','photo','publisher','scripting']) {
    for (const moduleId of await readdir(`curriculum/${track}`)) {
      const directory = `curriculum/${track}/${moduleId}`;
      for (const filename of (await readdir(directory)).filter(name => /^[DPBS]\d\d-\d\d\.json$/.test(name))) {
        const lesson = JSON.parse(await readFile(`${directory}/${filename}`, 'utf8'));
        expected.push({ id: lesson.id, module_id: lesson.moduleId, track_id: lesson.trackId });
      }
    }
  }
  assert.deepEqual(seeded, expected.sort((a, b) => a.id.localeCompare(b.id)));

  await db.query('INSERT INTO auth.users VALUES ($1,$2,$3,$4),($5,$6,$7,$8)', [
    learner, 'learner@example.invalid', { display_name: 'Learner', career_track: 'Editorial & Publication' }, {},
    evaluator, 'evaluator@example.invalid', { display_name: 'Evaluator' }, { role: 'evaluator' },
  ]);
  assert.equal((await db.query('SELECT career_track FROM profiles WHERE id = $1', [learner])).rows[0].career_track,
    'Editorial & Publication');

  await db.query("INSERT INTO lesson_progress (user_id, lesson_id, status, client_updated_at) VALUES ($1,'D01-01','completed','2026-11-20')", [learner]);
  await db.query("UPDATE lesson_progress SET status='in_progress', client_updated_at='2026-11-19' WHERE user_id=$1", [learner]);
  assert.equal((await db.query("SELECT status FROM lesson_progress WHERE user_id=$1", [learner])).rows[0].status, 'completed');
  const { rows: [bucket] } = await db.query("SELECT allowed_mime_types FROM storage.buckets WHERE id='submissions'");
  assert(bucket.allowed_mime_types.includes('text/markdown'));

  const files = {};
  for (const field of ['briefDeconstructionUrl', 'iterationLogUrl', 'vectorSourcePath', 'pixelSourcePath', 'printPdfPath', 'digitalWebpPath']) {
    files[field] = `${learner}/${assessment}/${field}`;
    await db.query("INSERT INTO storage.objects (bucket_id,name) VALUES ('submissions',$1)", [files[field]]);
  }
  await db.query("SELECT set_config('academy.fixture.user_id',$1,false)", [learner]);
  await db.exec('SET ROLE authenticated');
  const visible = await db.query('SELECT id FROM profiles');
  assert.deepEqual(visible.rows.map(row => row.id), [learner]);
  const { rows: [original] } = await db.query('SELECT public.submit_lumina_capstone($1,$2) AS id', [files, {}]);
  const { rows: [retried] } = await db.query('SELECT public.submit_lumina_capstone($1,$2) AS id', [files, {}]);
  assert.equal(retried.id, original.id);
  const { rows: [revision] } = await db.query('SELECT public.submit_lumina_capstone($1,$2) AS id',
    [{ ...files, additionalNotes: 'Revised rationale' }, {}]);
  assert.notEqual(original.id, revision.id);
  await db.exec('RESET ROLE');
  await db.query("SELECT set_config('academy.fixture.user_id',$1,false)", [evaluator]);
  await db.exec('SET ROLE authenticated');
  const levels = Object.fromEntries(['brief_interpretation', 'visual_communication', 'tool_selection', 'non_destructive',
    'iteration_critique', 'production_readiness', 'independent_transfer'].map(id => [id, 3]));
  await db.query('SELECT public.evaluate_lumina_capstone($1,$2,$3,$4)', [original.id, levels, {}, 'Fixture grading']);
  const { rows: [result] } = await db.query('SELECT submission_id, is_passed, total_weighted_score, certificate_id FROM assessment_results');
  assert.equal(result.submission_id, original.id);
  assert.equal(result.is_passed, true);
  assert.equal(Number(result.total_weighted_score), 75);
  await db.exec('RESET ROLE; SET ROLE anon');
  const { rows: [verified] } = await db.query('SELECT public.verify_affinity_certificate($1) AS valid', [result.certificate_id]);
  assert.equal(verified.valid, true);
  console.log('Postgres runtime OK: curriculum IDs, progress, profile metadata, account isolation, MIME, versioned capstone and certificate.');
} finally {
  await db.close();
}
