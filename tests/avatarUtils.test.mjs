import test from 'node:test';
import assert from 'node:assert/strict';
import { getInitials, hasValidAvatarUrl } from '../src/components/ui/avatarUtils.js';

test('getInitials returns initials from names', () => {
  assert.equal(getInitials('Ada Lovelace'), 'AL');
  assert.equal(getInitials(''), 'M');
});

test('hasValidAvatarUrl accepts https image URLs', () => {
  assert.equal(hasValidAvatarUrl('https://example.com/avatar.png'), true);
  assert.equal(hasValidAvatarUrl('http://example.com/avatar.png'), true);
  assert.equal(hasValidAvatarUrl('not-a-url'), false);
  assert.equal(hasValidAvatarUrl(''), false);
});
