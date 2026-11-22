/**
 * Affinity Academy local HTTP/SSE diagnostic (TASK-004 / REQ-SYS-004).
 * This cannot identify the installed build or verify Affinity DOM methods.
 */
import http from 'node:http';
import { pathToFileURL } from 'node:url';

export function probeAffinitySse({ hostname = 'localhost', port = 6767, timeoutMs = 2000 } = {}) {
    return new Promise((resolve) => {
        const request = http.request({
            hostname, port, path: '/sse', method: 'GET',
            headers: { Accept: 'text/event-stream' },
        }, (response) => {
            const statusCode = response.statusCode;
            const contentType = response.headers['content-type'] ?? '';
            const mediaType = contentType.split(';', 1)[0].trim().toLowerCase();
            const ok = statusCode === 200 && mediaType === 'text/event-stream';
            // An SSE stream may never finish. The diagnostic only needs headers.
            finish({ ok, statusCode, contentType });
        });
        const timer = setTimeout(() => {
            finish({ ok: false, error: `No response headers after ${timeoutMs}ms` });
        }, timeoutMs);
        function finish(result) {
            clearTimeout(timer);
            resolve(result);
            request.destroy();
        }
        request.on('error', (error) => finish({ ok: false, error: error.message || error.code || 'Connection failed' }));
        request.end();
    });
}

async function runDiagnostics() {
    console.log(`Affinity Academy HTTP/SSE diagnostic | Node ${process.version} | ${process.platform} (${process.arch})`);
    console.log('Checking http://localhost:6767/sse …');
    const result = await probeAffinitySse();
    if (result.ok) {
        console.log('[PASS] Endpoint returned HTTP 200 and text/event-stream.');
    } else {
        const detail = result.error ?? `HTTP ${result.statusCode}; Content-Type: ${result.contentType || '(missing)'}`;
        console.log(`[FAIL] Endpoint did not return an SSE response: ${detail}`);
        process.exitCode = 1;
    }
    console.log('Endpoint headers only. Installed Affinity version and DOM operations were not verified.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    await runDiagnostics();
}
