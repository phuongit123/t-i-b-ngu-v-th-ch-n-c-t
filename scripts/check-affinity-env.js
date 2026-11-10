/**
 * AFFINITY ACADEMY — Local Environment & MCP Diagnostic Utility
 * File: scripts/check-affinity-env.js
 * Verification Task: TASK-004 / REQ-SYS-004
 */

import http from 'node:http';

async function checkPort6767() {
    return new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost',
            port: 6767,
            path: '/sse',
            method: 'GET',
            timeout: 2000
        }, (res) => {
            resolve({
                connected: true,
                statusCode: res.statusCode,
                headers: res.headers
            });
        });

        req.on('error', (err) => {
            resolve({
                connected: false,
                error: err.message
            });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({
                connected: false,
                error: 'Connection timed out after 2000ms'
            });
        });

        req.end();
    });
}

async function runDiagnostics() {
    console.log('=== AFFINITY ACADEMY: LOCAL ENVIRONMENT DIAGNOSTIC ===');
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log(`Node.js Version: ${process.version}`);
    console.log(`Platform: ${process.platform} (${process.arch})`);

    console.log('\nChecking Affinity MCP Server on http://localhost:6767/sse...');
    const mcpStatus = await checkPort6767();

    if (mcpStatus.connected) {
        console.log(`[PASS] Affinity MCP Server is ACTIVE (HTTP Status: ${mcpStatus.statusCode})`);
    } else {
        console.log(`[WARN] Affinity MCP Server unreachable: ${mcpStatus.error}`);
        console.log('Ensure Serif Affinity 3.0 is running with MCP bridge enabled.');
    }

    console.log('\nDiagnostic Complete.');
}

runDiagnostics();
