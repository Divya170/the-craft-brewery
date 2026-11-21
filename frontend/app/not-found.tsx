import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main" className="smoke grain" style={{ minHeight: '100vh' }}><div className="wrap not-found">
      <p className="label">Page not found</p>
      <h1 className="d-xl">This one’s not on tap.</h1>
      <p className="lead">The link may be old, or the page may have moved.</p>
      <div className="row"><Link className="btn btn-copper" href="/">Back to Home</Link><Link className="btn btn-ghost" href="/visit-us">Plan Your Visit</Link></div>
    </div></main>
  );
}
