import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeEmail, sanitizeUsername, validatePassword, validateProfileData } from '../src/utils/authProfile.js';

test('normalizeEmail trims and lowercases', () => {
  assert.equal(normalizeEmail('  John@Example.COM '), 'john@example.com');
});

test('sanitizeUsername keeps a safe slug', () => {
  assert.equal(sanitizeUsername('  Jean Dupont 💡  '), 'jean-dupont');
  assert.equal(sanitizeUsername('   '), 'user');
});

test('validatePassword enforces complexity', () => {
  assert.equal(validatePassword('abc123').valid, false);
  assert.equal(validatePassword('Abc12345').valid, true);
});

test('validateProfileData rejects empty essentials', () => {
  const result = validateProfileData({ username: '  ', bio: '' });
  assert.equal(result.valid, false);
  assert.match(result.message, /nom d'utilisateur/i);
});
