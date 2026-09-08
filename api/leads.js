const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`
      SELECT id, name, email, phone, venue_type, event_volume, timeline, message, source_page, created_at
      FROM leads
      ORDER BY created_at DESC
      LIMIT 500
    `;
    return res.status(200).json({ ok: true, leads: rows });
  } catch (err) {
    console.error('leads fetch failed', err);
    return res.status(500).json({ ok: false, error: 'Something went wrong.' });
  }
};
