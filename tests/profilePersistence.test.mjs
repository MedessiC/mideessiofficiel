import test from 'node:test';
import assert from 'node:assert/strict';

import { getProfileSavePayloadAttempts } from '../src/utils/profilePersistence.js';

test('getProfileSavePayloadAttempts preserves profile details for Supabase', () => {
  const payloads = getProfileSavePayloadAttempts({
    id: 'user-1',
    email: 'jane@example.com',
    username: 'jane',
    avatar_url: 'https://example.com/avatar.png',
    bio: 'Product designer',
    website: 'https://mideessi.com',
    location: 'Cotonou',
    phone: '+22900000000',
    social_links: { linkedin: 'https://linkedin.com/in/jane' },
  });

  assert.equal(payloads.length, 2);
  assert.deepEqual(payloads[0].social_links, { linkedin: 'https://linkedin.com/in/jane' });
  assert.equal(payloads[0].website, 'https://mideessi.com');
  assert.equal(payloads[0].location, 'Cotonou');
  assert.equal(payloads[0].phone, '+22900000000');
  assert.equal(payloads[1].phone, '+22900000000');
});
