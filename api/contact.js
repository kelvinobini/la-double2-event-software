const { neon } = require('@neondatabase/serverless');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = 2000;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const body = req.body || {};
  const name = String(body.name || '').trim().slice(0, 200);
  const email = String(body.email || '').trim().slice(0, 200);
  const phone = String(body.phone || '').trim().slice(0, 60);
  const venueType = String(body.venueType || '').trim().slice(0, 100);
  const eventVolume = String(body.eventVolume || '').trim().slice(0, 100);
  const timeline = String(body.timeline || '').trim().slice(0, 100);
  const message = String(body.message || '').trim().slice(0, MAX_LEN);
  const sourcePage = String(body.sourcePage || '').trim().slice(0, 200);
  const honeypot = String(body.company || '').trim();

  // Silently accept and drop likely-bot submissions.
  if (honeypot) {
    return res.status(200).json({ ok: true });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'Name, email and message are required.' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ ok: false, error: 'Enter a valid email address.' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`
      INSERT INTO leads (name, email, phone, venue_type, event_volume, timeline, message, source_page)
      VALUES (${name}, ${email}, ${phone}, ${venueType}, ${eventVolume}, ${timeline}, ${message}, ${sourcePage})
    `;
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('contact insert failed', err);
    return res.status(500).json({ ok: false, error: 'Something went wrong. Please try again.' });
  }
};
