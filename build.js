const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');

const root = path.resolve(__dirname, '..');
const www = path.join(root, 'www');
fs.mkdirSync(www, { recursive: true });

async function main() {
  await esbuild.build({
    entryPoints: [path.join(root, 'scripts', 'native-bridge.js')],
    outfile: path.join(www, 'native-bridge.js'),
    bundle: true,
    platform: 'browser',
    format: 'iife',
    target: ['es2020'],
    sourcemap: false,
    legalComments: 'none'
  });
  const canvasSrc = path.join(root, 'node_modules', 'html2canvas', 'dist', 'html2canvas.min.js');
  const canvasDst = path.join(www, 'html2canvas.min.js');
  if (!fs.existsSync(canvasSrc)) throw new Error('html2canvas package nahi mila; npm install dobara chalayein.');
  fs.copyFileSync(canvasSrc, canvasDst);
  console.log('Web files ready: www/native-bridge.js and www/html2canvas.min.js');
}
main().catch(err => { console.error(err); process.exit(1); });
