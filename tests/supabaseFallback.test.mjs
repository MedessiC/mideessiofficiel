import test from 'node:test';
import assert from 'node:assert/strict';

import { supabase } from '../src/lib/supabase.ts';

test('supabase fallback client stays usable without env config', async () => {
  const queryResult = await supabase.from('admins').select('*').eq('id', 'abc').maybeSingle();
  assert.deepEqual(queryResult, { data: null, error: null });

  const sessionResult = await supabase.auth.getSession();
  assert.deepEqual(sessionResult, { data: { session: null }, error: null });

  const userResult = await supabase.auth.getUser();
  assert.equal(userResult.error, null);

  const authState = supabase.auth.onAuthStateChange(async () => {});
  assert.equal(authState.data.subscription, null);
});
