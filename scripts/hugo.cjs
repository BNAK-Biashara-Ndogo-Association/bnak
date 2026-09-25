const { spawnSync } = require('node:child_process');
const path = require('node:path');

// Keep Hugo's cache inside this project, including in restricted environments.
const result = spawnSync('hugo', process.argv.slice(2), {
  stdio: 'inherit',
  env: { ...process.env, HUGO_CACHEDIR: path.resolve(__dirname, '../.hugo_cache') },
});
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
