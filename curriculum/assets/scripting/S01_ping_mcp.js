/**
 * AFFINITY ACADEMY — S01-02 PRACTICE ASSET
 * Lesson: S01-02 Connecting to Local MCP Bridge (localhost:6767) & Status Pings
 * Description: Client-side diagnostic utility verifying connection to Affinity MCP SSE endpoint.
 */

import http from 'node:http';

console.log("=========================================");
console.log("   AFFINITY ACADEMY: MCP BRIDGE PING     ");
console.log("=========================================");

const options = {
  hostname: 'localhost',
  port: 6767,
  path: '/sse',
  method: 'GET',
  headers: {
    'Accept': 'text/event-stream'
  },
  timeout: 3000
};

const req = http.request(options, (res) => {
  console.log(`HTTP Status : ${res.statusCode}`);
  console.log(`Content-Type: ${res.headers['content-type']}`);
  if (res.statusCode === 200) {
    console.log("Result      : PASS — Affinity MCP Server is listening and healthy.");
  } else {
    console.log("Result      : WARN — Unexpected status from MCP server.");
  }
  res.destroy();
});

req.on('timeout', () => {
  console.error("Result      : FAIL — Connection to localhost:6767 timed out.");
  req.destroy();
});

req.on('error', (err) => {
  console.error(`Result      : FAIL — Could not reach localhost:6767: ${err.message}`);
});

req.end();
