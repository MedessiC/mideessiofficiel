import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const indexHtml = readFileSync(resolve(projectRoot, 'index.html'), 'utf8');

test('index.html exposes the Vite React entry script', () => {
  assert.match(indexHtml, /<script type="module" src="\/src\/main\.tsx"><\/script>/);
});
