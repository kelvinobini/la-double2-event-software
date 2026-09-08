export const config = {
  matcher: ['/admin.html', '/api/leads'],
};

export default function middleware(request) {
  const authHeader = request.headers.get('authorization');

  if (authHeader && authHeader.startsWith('Basic ')) {
    const decoded = atob(authHeader.slice(6));
    const sep = decoded.indexOf(':');
    const user = decoded.slice(0, sep);
    const pass = decoded.slice(sep + 1);
    if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASSWORD) {
      return;
    }
  }

  return new Response('Authentication required.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="LA Double2 Admin"' },
  });
}
