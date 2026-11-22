import assert from 'node:assert/strict';
import { once } from 'node:events';
import http from 'node:http';
import test from 'node:test';
import { probeAffinitySse } from './check-affinity-env.js';

async function withServer(handler, run) {
    const server = http.createServer(handler);
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    try {
        await run({ hostname: '127.0.0.1', port: server.address().port, timeoutMs: 1000 });
    } finally {
        const closed = once(server, 'close');
        server.close();
        server.closeAllConnections();
        await closed;
    }
}

test('accepts SSE headers without waiting for the stream to end', async () => {
    await withServer((req, res) => {
        assert.equal(req.url, '/sse');
        assert.equal(req.headers.accept, 'text/event-stream');
        res.writeHead(200, { 'Content-Type': 'text/event-stream; charset=utf-8' });
        res.flushHeaders();
    }, async (target) => assert.equal((await probeAffinitySse(target)).ok, true));
});

for (const [status, contentType] of [[404, 'text/event-stream'], [200, 'text/html']]) {
    test(`rejects HTTP ${status} with ${contentType}`, async () => {
        await withServer((_req, res) => {
            res.writeHead(status, { 'Content-Type': contentType });
            res.end();
        }, async (target) => {
            assert.deepEqual(await probeAffinitySse(target), { ok: false, statusCode: status, contentType });
        });
    });
}

test('times out if the server never sends headers', async () => {
    await withServer(() => {}, async (target) => {
        const result = await probeAffinitySse({ ...target, timeoutMs: 50 });
        assert.deepEqual(result, { ok: false, error: 'No response headers after 50ms' });
    });
});
