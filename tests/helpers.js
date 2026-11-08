import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/**
 * Start the built server over stdio and return the result of `tools/list`.
 */
export function listTools() {
    return new Promise((resolve, reject) => {
        const server = spawn(process.execPath, [fileURLToPath(new URL('../build/index.js', import.meta.url))], {
            stdio: ['pipe', 'pipe', 'inherit']
        });
        let buffer = '';
        server.stdout.on('data', (chunk) => {
            buffer += chunk;
            const newline = buffer.indexOf('\n');
            if (newline === -1) return;
            server.kill();
            try {
                resolve(JSON.parse(buffer.slice(0, newline)).result.tools);
            } catch (error) {
                reject(error);
            }
        });
        server.on('error', reject);
        server.on('exit', (code) => reject(new Error(`server exited with code ${code} before answering tools/list`)));
        server.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) + '\n');
    });
}
