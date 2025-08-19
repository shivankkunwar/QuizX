'use client';
import { useEffect, useState } from 'react';

// Minimal client for the Typeform worker
const ENV_WORKER_BASE = process.env.NEXT_PUBLIC_TYPEFORM_WORKER_BASE || '';

export function getTypeformWorkerBase() {
  if (typeof window === 'undefined') return ENV_WORKER_BASE || '';
  return localStorage.getItem('tf_worker_base') || ENV_WORKER_BASE || '';
}

export async function fetchTypeformStatus() {
  const base = getTypeformWorkerBase();
  if (!base) return { connected: false } as any;
  const r = await fetch(`${base}/status`, { credentials: 'include' });
  if (!r.ok) return { connected: false } as any;
  return r.json();
}

export async function startTypeformConnectFlow(): Promise<{ connected: boolean; account?: any }> {
  const existing = getTypeformWorkerBase();
  if (!existing) {
    const v = typeof window !== 'undefined' ? window.prompt('Enter Typeform service URL (e.g., https://typeform-worker.yourname.workers.dev)') : '';
    if (!v) return { connected: false };
    try { localStorage.setItem('tf_worker_base', v); } catch {}
  }
  const target = getTypeformWorkerBase();
  const returnTo = typeof window !== 'undefined' ? window.location.href : '/';
  const popup = typeof window !== 'undefined' ? window.open(`${target}/oauth/start?return_to=${encodeURIComponent(returnTo)}`, '_blank', 'width=480,height=720') : null;
  return new Promise((resolve) => {
    let timer = setTimeout(async function pollOnce(){
      const s = await fetchTypeformStatus();
      if (s.connected) return resolve(s);
      timer = setTimeout(pollOnce, 2000);
    }, 1500);
    const onMsg = (e: MessageEvent) => {
      if (e?.data && e.data.type === 'TF_CONNECTED') {
        clearTimeout(timer);
        window.removeEventListener('message', onMsg);
        resolve({ connected: true });
        try { popup && popup.close(); } catch {}
      }
    };
    window.addEventListener('message', onMsg);
  });
}

export async function createTypeformFromQuiz(quiz: any, opts?: { includeEmailField?: boolean }) {
  const base = getTypeformWorkerBase();
  if (!base) throw new Error('Typeform service not configured');
  const r = await fetch(`${base}/forms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ quiz, includeEmailField: opts?.includeEmailField })
  });
  if (!r.ok) {
    const txt = await r.text().catch(() => '');
    throw new Error(txt);
  }
  return r.json();
}

export default function TypeformConnect({ className }: { className?: string }) {
  const [status, setStatus] = useState<{ connected: boolean; account?: any }>({ connected: false });
  const [base, setBase] = useState<string>('');

  useEffect(() => {
    const b = getTypeformWorkerBase();
    if (b) setBase(b);
    fetchTypeformStatus().then(setStatus).catch(() => setStatus({ connected: false }));
  }, []);

  const handleConnect = async () => {
    const s = await startTypeformConnectFlow();
    setStatus(s);
  };

  const handleDisconnect = async () => {
    const worker = getTypeformWorkerBase();
    if (!worker) return;
    await fetch(`${worker}/disconnect`, { method: 'POST', credentials: 'include' });
    setStatus({ connected: false });
  };

  return (
    <div className={className || ''}>
      {!status.connected ? (
        <button
          onClick={handleConnect}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
        >
          Connect Typeform
        </button>
      ) : (
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">Typeform connected</span>
          <button onClick={handleDisconnect} className="text-xs text-stone-600 hover:underline">Disconnect</button>
        </div>
      )}
    </div>
  );
}


