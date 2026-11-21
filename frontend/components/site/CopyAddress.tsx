'use client';

import { useState } from 'react';
import { Icon } from './Icons';

export function CopyAddress({ text }: { text: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState('copied');
    } catch {
      setState('failed');
    }
    setTimeout(() => setState('idle'), 2600);
  }
  return (
    <>
      <button type="button" className="btn btn-ghost btn-sm" onClick={copy}>
        <Icon name={state === 'copied' ? 'check' : 'copy'} size={16} />{state === 'copied' ? 'Copied' : 'Copy Address'}
      </button>
      <span className="sr-only" aria-live="polite">{state === 'copied' ? 'Address copied to clipboard' : state === 'failed' ? `Couldn’t copy. The address is ${text}` : ''}</span>
    </>
  );
}
