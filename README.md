# MentorMatch

MentorMatch is being migrated from PHP to Next.js. The Node application is in
`app/` and `lib/`; its current migrated features include the public landing and
account pages, mentor search, and session APIs. The remaining role dashboards,
payments, admin workflows, and scheduled jobs still use the PHP code in
`frontend/` and `backend/`.

The Render Blueprint uses the native Node runtime and Yarn. This is an
incomplete migration: the legacy role dashboards, payments, admin workflows,
and scheduled jobs remain in PHP and are not served by the Node deployment.

To build the Next.js application locally:

```sh
yarn install --frozen-lockfile
yarn build
yarn start
```

The Node app uses PostgreSQL when `DATABASE_URL` is set (as in the Render
Blueprint) and MariaDB/MySQL for local XAMPP development. It also requires a
`SESSION_SECRET` containing at least 32 characters. Render generates the
session secret from the Blueprint. See `.env.example` for local configuration.

For local development, start MySQL from the XAMPP Control Panel and import
`backend/database/schema.mysql.sql` into MariaDB. Configure `.env.local` with
`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, and `SESSION_SECRET`.
The default XAMPP root account has no password; use that only for local
development and set a password or restricted database user before exposing
MariaDB to other machines.
The original `backend/database/schema.sql` and PHP database configuration
remain PostgreSQL-specific for the legacy PHP application.
