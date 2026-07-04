import test from 'node:test';
import assert from 'node:assert/strict';
import { getSecurityHeaders } from '../server/securityHeaders.js';

test('getSecurityHeaders includes a restrictive CSP and transport protections', () => {
  const headers = getSecurityHeaders();

  assert.match(headers['Content-Security-Policy'], /default-src 'self'/);
  assert.equal(headers['Strict-Transport-Security'], 'max-age=31536000; includeSubDomains');
  assert.equal(headers['X-Content-Type-Options'], 'nosniff');
  assert.equal(headers['X-Frame-Options'], 'DENY');
});
