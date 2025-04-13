import { spawn } from 'child_process';
import { join, resolve } from 'path';

// Path to the server script
const serverPath = resolve('dist/index.js');

// Spawn the server process
const serverProcess = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Handle server output
serverProcess.stdout.on('data', (data) => {
  console.log(`Server stdout: ${data}`);
});

serverProcess.stderr.on('data', (data) => {
  console.error(`Server stderr: ${data}`);
});

// Handle server exit
serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Send a test message to the server
const testMessage = JSON.stringify({
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: {
    protocolVersion: '0.1.0',
    capabilities: {
      tools: {
        execution: true
      }
    }
  }
});

// Write the message to the server's stdin
serverProcess.stdin.write(`Content-Length: ${Buffer.byteLength(testMessage, 'utf8')}\r\n\r\n${testMessage}`);

// Wait for a bit and then kill the server
setTimeout(() => {
  console.log('Killing server process...');
  serverProcess.kill();
}, 5000);
