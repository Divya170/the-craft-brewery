/** Inline stroke icons (no emoji, no icon font). Decorative unless `label` is given. */
const P: Record<string, React.ReactNode> = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  back: <path d="M19 12H5M11 6l-6 6 6 6" />,
  ext: <path d="M7 17 17 7M9 7h8v8" />,
  chevL: <path d="M15 6l-6 6 6 6" />,
  chevR: <path d="M9 6l6 6-6 6" />,
  chevD: <path d="M6 9l6 6 6-6" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M3 7h18M3 12h18M9 17h12" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  alert: <><circle cx="12" cy="12" r="10" /><path d="M12 7v6M12 16.5h.01" /></>,
  copy: <><rect x="8" y="8" width="12" height="12" rx="1" /><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" /></>,
  pin: <><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m3 7 9 6 9-6" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  image: <><rect x="3" y="5" width="18" height="14" rx="1" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-8 8" /></>,
  minus: <><circle cx="12" cy="12" r="9" /><path d="M8 12h8" /></>,
};

export function Icon({ name, size = 18, sw = 2, label, className, style }: { name: string; size?: number; sw?: number; label?: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      className={className} style={style} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {P[name] ?? P.arrow}
    </svg>
  );
}

export function PlayPause({ paused }: { paused: boolean }) {
  return paused
    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5v14l12-7z" /></svg>
    : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>;
}

/** Hop-cone badge mark. `tone`: copper on dark (default), copper-deep on light, or solid ink on copper. */
export function HopMark({ size = 44, tone = 'dark' }: { size?: number; tone?: 'dark' | 'light' | 'ink' }) {
  const ring = tone === 'dark' ? '#A58A61' : tone === 'light' ? '#20211F' : '#151614';
  const hop = tone === 'dark' ? '#D08E60' : tone === 'light' ? '#8E5532' : '#151614';
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden="true">
      <circle cx="22" cy="22" r="21" fill="none" stroke={ring} strokeWidth="1.2" />
      <circle cx="22" cy="22" r="17.5" fill="none" stroke={ring} strokeWidth=".6" strokeDasharray="1.5 2.5" />
      <path d="M22 10.5v3.2" stroke={hop} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M22 13.6c-4.4 2.6-5.4 9.4-0.1 17.6 5.3-8.2 4.4-15 .1-17.6z" fill="none" stroke={hop} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M18.4 18.2 22 20.4l3.6-2.2M17.8 22.6 22 25.2l4.2-2.6M19.2 27.2 22 29l2.8-1.8" fill="none" stroke={hop} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Wordmark() {
  return <><HopMark /><span className="wm"><small>The</small><b>Craft Brewery</b></span></>;
}
