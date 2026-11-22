/**
 * TASK-030 / REQ-BE-001, TASK-033 / REQ-BE-004.
 * Real PostgreSQL migrations, run entirely in memory. Only Supabase-managed
 * schemas, roles, and session plumbing are stubbed. No network or credentials.
 */
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';

const migrations = new URL('../supabase/migrations/', import.meta.url);
const seedName = '20261116000006_curriculum_index_backfill.sql';
const migrationNames = [
  '20261116000001_initial_schema.sql',
  '20261116000002_progress_and_assessments.sql',
  '20261116000003_rls_policies.sql',
  '20261116000004_storage_buckets.sql',
  '20261116000005_seed_data.sql',
  seedName,
];
const read = (url) => readFileSync(url, 'utf8');
const root = new URL('../curriculum/', import.meta.url);
const trackIds = ['designer', 'photo', 'publisher', 'scripting'];
const expectedModules = [];
const expectedLessons = [];
for (const trackId of trackIds) {
  const trackDir = new URL(trackId + '/', root);
  for (const id of readdirSync(trackDir).filter((name) => /^[DPBS]\d{2}$/.test(name))) {
    expectedModules.push({ id, track_id: trackId });
    const moduleDir = new URL(id + '/', trackDir);
    // Some older module manifests omit lessonIds; follow the shipped lesson JSON files.
    for (const filename of readdirSync(moduleDir).filter((name) => /^[DPBS]\d{2}-\d{2}\.json$/.test(name))) {
      const lesson = JSON.parse(read(new URL(filename, moduleDir)));
      assert.equal(lesson.moduleId, id, filename);
      assert.equal(lesson.trackId, trackId, filename);
      expectedLessons.push({
        id: lesson.id, module_id: id, track_id: trackId,
        order_index: lesson.order, title_en: lesson.title,
        duration_minutes: lesson.durationMinutes, difficulty: lesson.difficulty,
      });
    }
  }
}
const byId = (a, b) => a.id.localeCompare(b.id, 'en');
expectedModules.sort(byId);
expectedLessons.sort(byId);
assert.equal(expectedModules.length, 22);
assert.equal(expectedLessons.length, 66);

const infrastructure = `
CREATE ROLE authenticated;
CREATE ROLE anon;
CREATE SCHEMA auth;
CREATE TABLE auth.users (id uuid PRIMARY KEY, email text, raw_user_meta_data jsonb, raw_app_meta_data jsonb);
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;
CREATE SCHEMA storage;
CREATE TABLE storage.buckets (id text PRIMARY KEY, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
CREATE TABLE storage.objects (bucket_id text, name text);
CREATE FUNCTION storage.foldername(text) RETURNS text[] LANGUAGE sql IMMUTABLE AS $$
  SELECT (string_to_array($1, '/'))[1:cardinality(string_to_array($1, '/'))-1]
$$;
`;
const userId = '00000000-0000-0000-0000-000000000001';
const rows = async (db, sql, params = []) => (await db.query(sql, params)).rows;
const apply = (db, name) => db.exec(read(new URL(name, migrations)));
const upsertProgress = (db, lessonId, slideIndex) => rows(db, `
  INSERT INTO public.lesson_progress (user_id, lesson_id, status, last_slide_index)
  VALUES ($1, $2, 'completed', $3)
  ON CONFLICT (user_id, lesson_id) DO UPDATE SET
    status = EXCLUDED.status, last_slide_index = EXCLUDED.last_slide_index
  RETURNING id, lesson_id, status, last_slide_index
`, [userId, lessonId, slideIndex]);

async function createLearner(db) {
  await db.query('INSERT INTO auth.users (id, email) VALUES ($1, $2)', [userId, 'seed-check@example.invalid']);
  assert.deepEqual(await rows(db, 'SELECT role FROM public.profiles WHERE id = $1', [userId]), [{ role: 'student' }]);
  // Supabase normally provisions these grants. The migrations themselves enforce RLS.
  await db.exec(`
    GRANT USAGE ON SCHEMA auth TO authenticated;
    GRANT SELECT, INSERT, UPDATE ON public.lesson_progress TO authenticated;
    SET request.jwt.claim.sub = '${userId}';
    SET ROLE authenticated;
  `);
}

async function assertCatalogue(db, { preserveLegacyLesson = false } = {}) {
  const tracks = (await rows(db, 'SELECT id FROM public.tracks')).map(({ id }) => id).sort();
  assert.deepEqual(tracks, [...trackIds].sort());
  assert.deepEqual((await rows(db, 'SELECT id, track_id FROM public.modules')).sort(byId), expectedModules);
  const lessons = await rows(db, 'SELECT id, module_id, track_id, order_index, title_en, duration_minutes, difficulty FROM public.lessons');
  assert.deepEqual(lessons.sort(byId), expectedLessons.map((lesson) =>
    preserveLegacyLesson && lesson.id === 'D01-02'
      ? { ...lesson, title_en: 'Preserved legacy title' }
      : lesson
  ));
}

async function verifyFresh() {
  const db = new PGlite();
  try {
    await db.exec(infrastructure);
    for (const name of migrationNames) await apply(db, name);
    await assertCatalogue(db);
    await createLearner(db);
    const [row] = await upsertProgress(db, 'D01-01', 2);
    assert.equal(row.lesson_id, 'D01-01');
    assert.equal(row.status, 'completed');
    assert.equal(row.last_slide_index, 2);
    console.log('Fresh database: 4 tracks, 22 modules, 66 lessons; D01-01 progress persisted.');
  } finally {
    await db.close();
  }
}

async function verifyUpgrade() {
  const db = new PGlite();
  try {
    await db.exec(infrastructure);
    for (const name of migrationNames.slice(0, -1)) await apply(db, name);

    assert.deepEqual(await rows(db, 'SELECT count(*)::int AS n FROM public.lessons'), [{ n: 0 }]);
    const legacyLesson = expectedLessons.find(({ id }) => id === 'D01-02');
    await db.query(`
      INSERT INTO public.lessons (id, module_id, track_id, order_index, title_vi, title_en, duration_minutes, difficulty)
      VALUES ('D01-02', 'D01', 'designer', $1, 'Legacy title', 'Preserved legacy title', $2, $3)
    `, [legacyLesson.order_index, legacyLesson.duration_minutes, legacyLesson.difficulty]);

    await createLearner(db);
    const [before] = await upsertProgress(db, 'D01-02', 5);
    await assert.rejects(upsertProgress(db, 'D01-01', 2), {
      code: '23503', constraint: 'lesson_progress_lesson_id_fkey',
    });

    await db.exec('RESET ROLE');
    const preservedBefore = await rows(db, 'SELECT * FROM public.lesson_progress WHERE id = $1', [before.id]);
    const resourcesBefore = await rows(db, 'SELECT id FROM public.learning_resources ORDER BY id');
    await apply(db, seedName);
    await assertCatalogue(db, { preserveLegacyLesson: true });
    await apply(db, seedName); // Direct replay of migration 6 is safe.
    await assertCatalogue(db, { preserveLegacyLesson: true });
    assert.deepEqual(await rows(db, 'SELECT * FROM public.lesson_progress WHERE id = $1', [before.id]), preservedBefore);
    assert.deepEqual(await rows(db, 'SELECT id FROM public.learning_resources ORDER BY id'), resourcesBefore);
    await db.exec('SET ROLE authenticated');
    const [after] = await upsertProgress(db, 'D01-01', 2);
    assert.equal(after.status, 'completed');
    console.log('Upgrade and replay: D01-01 progress fixed; existing lesson, progress, and resources preserved.');
  } finally {
    await db.close();
  }
}

await verifyFresh();
await verifyUpgrade();
