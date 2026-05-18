#!/usr/bin/env node
import { runDaemonCliStartup } from './daemon-startup.js';

function printHelp(): void {
  console.log(`Usage: od [--host <host>] [--port <port>] [--no-open]\n\nStarts the Open Design web daemon.`);
}

await runDaemonCliStartup(process.argv.slice(2), { printHelp });
