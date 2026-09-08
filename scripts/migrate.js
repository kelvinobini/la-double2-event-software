const { neon } = require('@neondatabase/serverless');

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      venue_type TEXT,
      event_volume TEXT,
      timeline TEXT,
      message TEXT,
      source_page TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  console.log('leads table ready');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
