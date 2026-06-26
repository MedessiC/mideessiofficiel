# Database Setup Guide

## Quick Start - Apply All Migrations Now

### Option 1: One-Click Method (Recommended)
1. Open your Supabase Dashboard
2. Go to **SQL Editor** → **New Query**
3. Open and copy the entire content of: [SUPABASE_COMPLETE_MIGRATION.sql](SUPABASE_COMPLETE_MIGRATION.sql)
4. Paste it into the SQL Editor
5. Click **Run** (top right)
6. Wait for "✅ Success" message

### Option 2: Line-by-Line Method
If Option 1 fails, run these migrations separately:

1. **Create Tables & Indexes**
   - Copy from [SUPABASE_COMPLETE_MIGRATION.sql](SUPABASE_COMPLETE_MIGRATION.sql) - Steps 1-4
   - Run in SQL Editor

2. **Create RPC Function**
   - Copy from [SUPABASE_COMPLETE_MIGRATION.sql](SUPABASE_COMPLETE_MIGRATION.sql) - Steps 6-7
   - Run in SQL Editor

3. **Configure Permissions**
   - Copy from [SUPABASE_COMPLETE_MIGRATION.sql](SUPABASE_COMPLETE_MIGRATION.sql) - Steps 8-10
   - Run in SQL Editor

## Verify Setup is Working

### Step 1: Check if migrations were applied
In Supabase SQL Editor, run this verification query:
```sql
SELECT COUNT(*) as sequences_rows FROM sequences;
SELECT EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'next_client_id') as function_exists;
```

**Expected:** sequences_rows = 2, function_exists = true

### Step 2: Start dev server and test API

```bash
# Terminal 1: Start the server
npm run dev

# Terminal 2: Check database status
curl http://localhost:5173/api/debug/db-status
```

**Expected response:**
```json
{
  "status": "ok",
  "message": "All database tables and functions are properly configured",
  "checks": {
    "sequences_table": "accessible",
    "clients_table": "accessible",
    "client_infos_table": "accessible",
    "next_client_id_rpc": "working",
    "last_generated_id": "PD-XXX"
  }
}
```

## Environment Variables Required

Ensure these are set in your `.env` file:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # CRITICAL for admin operations

# Site URL (for email invites)
SITE_URL=https://mideessi.com
```

**⚠️ Important:** The `SUPABASE_SERVICE_ROLE_KEY` is CRITICAL for the admin endpoints to work. Without it, they fall back to the anon key, which has limited permissions.

## Troubleshooting

### Error: "Sequences table not found"
- Migration `20260604_add_sequences_and_ids.sql` hasn't been run
- Solution: Apply the migration via Supabase Dashboard

### Error: "Échec génération ID" (500 error)
- Check `/api/debug/db-status` for specific details
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Check Supabase function permissions

### Error: "Échec insertion client"
- `clients` table not properly initialized
- Missing required fields in request
- RLS policies preventing insert

### Error: "next_client_id RPC function failed"
- Function doesn't exist or has syntax errors
- Check migration `20260604_add_sequences_and_ids.sql` was applied
- Verify `SECURITY DEFINER` and `GRANT` statements are in place

## Testing Create Client Flow

1. **Test ID Generation:**
   ```bash
   curl -X POST http://localhost:5173/api/next-client-id \
     -H "Content-Type: application/json" \
     -d '{"pole": "presence_digitale"}'
   ```

2. **Test Create Client (Full Flow):**
   Navigate to the Admin Dashboard and use the "Create Client Wizard"

## Architecture Notes

- **Atomic ID Generation:** Uses PostgreSQL sequences with `SECURITY DEFINER` function to ensure unique client IDs
- **Service Role Key:** Required for admin operations that bypass RLS restrictions
- **Auth Integration:** Optionally creates Supabase Auth user when service role key is available
- **Email Invites:** Sends welcome email with temporary credentials (best-effort)
