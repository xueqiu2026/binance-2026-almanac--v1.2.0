import { Plugin } from 'vite';
import { spawn, ChildProcess } from 'child_process';
import fs from 'fs';
import path from 'path';

let activeProcess: ChildProcess | null = null;

export function batchControlPlugin(): Plugin {
    return {
        name: 'frozen-light-batch-control',
        configureServer(server) {
            server.middlewares.use('/api/batch', (req, res, next) => {
                // Handle CORS just in case
                res.setHeader('Access-Control-Allow-Origin', '*');

                if (req.method === 'GET' && req.url === '/status') {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ status: activeProcess ? 'RUNNING' : 'IDLE' }));
                    return;
                }

                if (req.method === 'POST') {
                    if (req.url === '/start') {
                        if (activeProcess) {
                            res.statusCode = 409;
                            res.end(JSON.stringify({ status: 'ALREADY_RUNNING' }));
                            return;
                        }

                        console.log(':: UI TRIGGER :: Starting Batch Generator (Engine B)...');

                        // Spawn Node Process
                        // stdio: 'inherit' means the output appears in the main VSCode/Terminal console
                        activeProcess = spawn('node', ['scripts/batch-generate-v10.js'], {
                            cwd: process.cwd(),
                            stdio: 'inherit',
                            shell: true
                        });

                        activeProcess.on('close', (code) => {
                            console.log(`:: UI TRIGGER :: Batch Generator exited with code ${code}`);
                            activeProcess = null;
                        });

                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ status: 'STARTED' }));
                        return;
                    }

                    if (req.url === '/stop') {
                        if (activeProcess) {
                            console.log(':: UI TRIGGER :: Stopping Batch Generator...');
                            if (process.platform === 'win32' && activeProcess.pid) { spawn('taskkill', ['/pid', activeProcess.pid.toString(), '/f', '/t']); }
                            else { activeProcess.kill(); }
                            activeProcess = null;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ status: 'STOPPED' }));
                        } else {
                            res.statusCode = 200;
                            res.end(JSON.stringify({ status: 'NOT_RUNNING' }));
                        }
                        return;
                    }

                    // === NEW: SINGLE CAPTURE ENDPOINT ===
                    if (req.url === '/capture') {
                        let body = '';
                        req.on('data', chunk => body += chunk.toString());
                        req.on('end', () => {
                            try {
                                const { month, day } = JSON.parse(body);

                                // === SECURITY: INPUT VALIDATION ===
                                if (typeof month !== 'number' || typeof day !== 'number') {
                                    throw new Error('Invalid Type: Month/Day must be numbers');
                                }
                                if (month < 0 || month > 11 || day < 1 || day > 31) {
                                    throw new Error('Invalid Range: Month(0-11), Day(1-31)');
                                }

                                console.log(`:: UI TRIGGER :: Single Capture Request: Month ${month}, Day ${day}`);

                                // Spawn Engine B (V10) in Single Mode
                                const captureProcess = spawn('node', [
                                    'scripts/batch-generate-v10.js',
                                    '--single',
                                    `--month=${month}`,
                                    `--day=${day}`
                                ], {
                                    cwd: process.cwd(),
                                    stdio: 'inherit',
                                    shell: true
                                });

                                captureProcess.on('close', (code) => {
                                    console.log(`:: UI TRIGGER :: Single Capture completed with code ${code}`);

                                    if (code === 0) {
                                        // Auto-Send back to Client
                                        const monStr = String(month + 1).padStart(2, '0');
                                        const dayStr = String(day).padStart(2, '0');
                                        const filename = `2026_${monStr}_${dayStr}.png`;
                                        const filePath = path.join(process.cwd(), 'dist/frozen_light/raw', filename);

                                        if (fs.existsSync(filePath)) {
                                            const fileBuffer = fs.readFileSync(filePath);
                                            res.setHeader('Content-Type', 'image/png');
                                            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
                                            res.end(fileBuffer);
                                        } else {
                                            res.statusCode = 404;
                                            res.end(JSON.stringify({ error: 'File generated but not found' }));
                                        }
                                    } else {
                                        res.statusCode = 500;
                                        res.end(JSON.stringify({ status: 'FAILED' }));
                                    }
                                });

                            } catch (e) {
                                res.statusCode = 400;
                                res.end(JSON.stringify({ error: 'Invalid Payload' }));
                            }
                        });
                        return;
                    }
                }
                next();
            });
        }
    };
}
