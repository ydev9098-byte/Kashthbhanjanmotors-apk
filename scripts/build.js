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
  const pdfSrc = path.join(root, 'node_modules', 'jspdf', 'dist', 'jspdf.umd.min.js');
  const pdfDst = path.join(www, 'jspdf.umd.min.js');
  if (!fs.existsSync(pdfSrc)) throw new Error('jsPDF package nahi mila; npm install dobara chalayein.');
  fs.copyFileSync(pdfSrc, pdfDst);
  console.log('Web files ready: native bridge, html2canvas and jsPDF.');
}
main().catch(err => { console.error(err); process.exit(1); });
