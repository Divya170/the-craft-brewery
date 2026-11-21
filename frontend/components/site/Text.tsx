import { emphasis } from '@/lib/api';

/** Renders "*words*" in a heading as the italic serif accent (copper on dark, deep copper on cream). */
export function Em({ text }: { text: string }) {
  const { before, em, after } = emphasis(text);
  if (!em) return <>{text}</>;
  return <>{before}<em>{em}</em>{after}</>;
}

/** A heading ending in a full stop gets the copper full stop from the design. */
export function Stop({ text }: { text: string }) {
  const t = text.trim();
  if (!t.endsWith('.')) return <Em text={t} />;
  return <><Em text={t.slice(0, -1)} /><span style={{ color: 'var(--copper)' }}>.</span></>;
}

/** Dashed "to be supplied" note, shown only while the admin leaves a note on the record. */
export function SupplyNote({ note, tag = 'To be supplied', small = true }: { note?: string | null; tag?: string; small?: boolean }) {
  if (!note) return null;
  return (
    <div className={`tbs-note ${small ? 'small' : ''}`}>
      <span className="tbs" style={{ marginBottom: 10 }}>{tag}</span>
      <p>{note}</p>
    </div>
  );
}
