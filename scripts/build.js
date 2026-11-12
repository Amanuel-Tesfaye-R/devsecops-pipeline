const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const minimist = require('minimist');

const args = minimist(process.argv.slice(2));
const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'src');
const distDir = path.join(root, String(args.out || 'dist'));

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

for (const file of fs.readdirSync(srcDir)) {
  if (!file.endsWith('.js')) continue;
  const srcFile = path.join(srcDir, file);
  execFileSync(process.execPath, ['--check', srcFile], { stdio: 'inherit' });
  fs.copyFileSync(srcFile, path.join(distDir, file));
}

console.log('Build succeeded: syntax checked and artifacts written to dist/');
