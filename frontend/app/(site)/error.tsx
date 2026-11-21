'use client';

import Link from 'next/link';
import { RetryButton } from './RetryButton';

export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main id="main" className="smoke grain"><div className="wrap not-found">
      <p className="label">Something went wrong</p>
      <h1 className="d-xl">This page couldn’t load.</h1>
      <p className="lead">Please try again. You can still find the brewery’s address and email on the Visit Us page.</p>
      <div className="row"><RetryButton reset={reset} /><Link className="btn btn-ghost" href="/visit-us">Visit Us</Link></div>
    </div></main>
  );
}
