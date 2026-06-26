## Appliquer les migrations Supabase / Postgres

Deux options : `psql` (direct) ou `supabase` CLI.

1) Avec `psql` (direct sur la base) :

```bash
# exportez vos variables
export DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# puis exécutez chaque fichier sql dans l'ordre des migrations
psql "$DATABASE_URL" -f supabase/migrations/20260414_create_clients_system.sql
psql "$DATABASE_URL" -f supabase/migrations/20260604_add_sequences_and_ids.sql
psql "$DATABASE_URL" -f supabase/migrations/20260604_add_auth_userid.sql
psql "$DATABASE_URL" -f supabase/migrations/20260604_rls_client_access.sql
```

2) Avec `supabase` CLI (recommandé si vous gérez projet Supabase) :

```bash
# initialiser la CLI et faire login si nécessaire
supabase db remote set "<remote-db-alias>"
supabase db reset # optionnel pour dev
supabase db push --schema supabase/migrations
```

Notes:
- Assurez-vous d'avoir un backup avant d'exécuter des migrations en production.
- La fonction `next_client_id(pole_input)` attend les valeurs de `pole` suivantes : `presence_digitale` ou `dev_tech`.
- Pour que `/api/create-client` crée un utilisateur dans Supabase Auth, fournissez `SUPABASE_SERVICE_ROLE_KEY` dans vos variables d'environnement.
