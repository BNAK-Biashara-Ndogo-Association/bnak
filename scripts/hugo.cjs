const { spawnSync } = require('node:child_process');
const path = require('node:path');

// Keep Hugo's cache inside this project, including in restricted environments.
const result = spawnSync('hugo', process.argv.slice(2), {
  stdio: 'inherit',
  env: { ...process.env, HUGO_CACHEDIR: path.resolve(__dirname, '../.hugo_cache') },
});
if (result.error) {
  if (result.error.code === 'ENOENT') {
    console.error(
      'Hugo executable "hugo" was not found. Install Hugo Extended and ensure "hugo" is on PATH before building this site.',
    );
  } else {
    console.error(result.error.message);
  }
}
process.exit(result.status ?? 1);
