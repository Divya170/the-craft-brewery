export function PageSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-label="Loading page" style={{ minHeight: '80vh', background: 'var(--smoke)', paddingTop: 160 }}>
      <span className="sr-only">Loading…</span>
      <div className="wrap stack" style={{ gap: 18 }}>
        <div className="skel" style={{ height: 12, width: 180 }} />
        <div className="skel" style={{ height: 90, width: '70%' }} />
        <div className="skel" style={{ height: 90, width: '50%' }} />
        <div className="skel" style={{ height: 18, width: '40%', marginTop: 10 }} />
        <div className="skel" style={{ height: 52, width: 220, marginTop: 16 }} />
      </div>
    </div>
  );
}
