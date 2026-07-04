import test from 'node:test';
import assert from 'node:assert/strict';
import { getProviderAvatarUrl } from '../src/utils/providerProfile.js';

test('getProviderAvatarUrl reads avatar from Google metadata', () => {
  const metadata = { picture: 'https://lh3.googleusercontent.com/a/abc' };
  assert.equal(getProviderAvatarUrl(metadata), 'https://lh3.googleusercontent.com/a/abc');
});

test('getProviderAvatarUrl falls back to avatar_url if present', () => {
  const metadata = { avatar_url: 'https://example.com/avatar.png' };
  assert.equal(getProviderAvatarUrl(metadata), 'https://example.com/avatar.png');
});
