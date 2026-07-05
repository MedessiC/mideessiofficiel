import test from 'node:test';
import assert from 'node:assert/strict';
import { getStoredRedirectTarget, persistRedirectTarget, clearStoredRedirectTarget } from '../src/utils/authRedirect.ts';

test('persists a relative redirect target from query param', () => {
  const originalLocation = globalThis.location;
  Object.defineProperty(globalThis, 'location', {
    value: new URL('https://example.com/library/book-1?foo=bar'),
    configurable: true,
  });

  clearStoredRedirectTarget();
  persistRedirectTarget('/library/book-1?foo=bar');

  assert.equal(getStoredRedirectTarget('/'), '/library/book-1?foo=bar');

  Object.defineProperty(globalThis, 'location', {
    value: originalLocation,
    configurable: true,
  });
});

test('ignores auth pages and resets stored target', () => {
  clearStoredRedirectTarget();
  persistRedirectTarget('/login');
  assert.equal(getStoredRedirectTarget('/'), '/');
  clearStoredRedirectTarget();
});
