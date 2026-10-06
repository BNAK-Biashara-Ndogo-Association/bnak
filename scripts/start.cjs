const { spawn, spawnSync } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const tailwind = path.join(root, 'node_modules', '@tailwindcss', 'cli', 'dist', 'index.mjs');
const cssArgs = [
  tailwind,
  '--input', 'assets/css/main.css',
  '--output', 'assets/css/generated.css',
];

const initialBuild = spawnSync(process.execPath, [...cssArgs, '--minify'], {
  cwd: root,
  stdio: 'inherit',
});

if (initialBuild.error) {
  console.error(initialBuild.error.message);
  process.exit(1);
}
if (initialBuild.status !== 0) process.exit(initialBuild.status ?? 1);

const env = {
  ...process.env,
  HUGO_CACHEDIR: path.join(root, '.hugo_cache'),
};
const children = [
  spawn(process.execPath, [...cssArgs, '--watch=always'], { cwd: root, stdio: 'inherit' }),
  spawn('hugo', ['server', ...process.argv.slice(2)], { cwd: root, env, stdio: 'inherit' }),
];
let stopping = false;

function stop(code) {
  if (stopping) return;
  stopping = true;
  process.exitCode = code;
  for (const child of children) {
    if (child.exitCode === null) child.kill();
  }
}

for (const child of children) {
  child.on('error', (error) => {
    console.error(error.message);
    stop(1);
  });
  child.on('exit', (code) => {
    if (!stopping) stop(code ?? 1);
  });
}

process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));
