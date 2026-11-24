import assert from 'node:assert/strict';
import { setTimeout as sleep } from 'node:timers/promises';
import { createServer } from 'vite';

process.env.VITE_SUPABASE_URL = 'http://127.0.0.1:5192';
process.env.VITE_SUPABASE_ANON_KEY = 'fixture-only-key-for-local-test';
const owner = 'f0000000-0000-4000-8000-000000000001';
const store = new Map();
Object.defineProperty(globalThis, 'localStorage', { value: {
  getItem: key => store.get(key) ?? null,
  setItem: (key, value) => store.set(key, value),
  removeItem: key => store.delete(key),
} });
Object.defineProperty(globalThis, 'window', { value: new EventTarget() });
Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });

const sends = [];
let sendResponse;
const delayedFirstWrite = new Promise(resolve => { sendResponse = resolve; });
globalThis.fetch = async (input, opts) => {
  const url = new URL(typeof input === 'string' ? input : input.url ?? input.href);
  assert.equal(url.origin, process.env.VITE_SUPABASE_URL);
  assert(url.pathname.endsWith('/lesson_progress'));
  if (opts.method === 'GET') return Response.json([]);
  const payload = JSON.parse(opts.body);
  sends.push(payload);
  if (sends.length === 1) return delayedFirstWrite;
  return new Response(null, { status: 201 });
};

async function until(predicate) {
  for (let attempt = 0; attempt < 200; attempt++) {
    if (predicate()) return;
    await sleep(25);
  }
  throw new Error('Timed out waiting for progress sync');
}

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
let stop;
try {
  const sync = await server.ssrLoadModule('/src/lib/supabase/progress-sync.ts');
  stop = sync.startProgressSync(owner);
  await until(() => sync.getSyncStatus() === 'synced');
  const save = (lessonId, lastSlideIndex) => sync.saveLessonProgress(owner, { lessonId, lastSlideIndex, status: 'in_progress' });

  await save('D01-01', 1);
  await until(() => sends.length === 1);
  await save('D01-02', 2);
  await save('D01-01', 3);
  sendResponse(Response.json({ message: 'fixture storage unavailable' }, { status: 400 }));
  await until(() => sends.length === 3 && sync.getSyncStatus() === 'synced');
  assert.equal(sends.filter(row => row.lesson_id === 'D01-01').at(-1).last_slide_index, 3);
  assert.equal(sends.find(row => row.lesson_id === 'D01-02').last_slide_index, 2);
  assert.equal(sync.getAllLocalProgress(owner)['D01-01'].lastSlideIndex, 3);
  console.log('Progress sync runtime OK: failed old write preserved the newer same-lesson and different-lesson updates.');
} finally {
  stop?.();
  await server.close();
}
