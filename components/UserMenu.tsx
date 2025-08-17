'use client';

import { useEffect, useRef, useState } from 'react';
import { useUserId } from '@/hooks/useUserId';
import { Copy, Check, Pencil, Github, ChevronDown, User2 } from 'lucide-react';

export default function UserMenu() {
  const userId = useUserId();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newId, setNewId] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
        setEditing(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setEditing(false);
      }
    };
    window.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    if (editing && userId) setNewId(userId);
  }, [editing, userId]);

  const handleCopy = async () => {
    if (!userId) return;
    await navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleSaveId = async () => {
    const val = newId.trim();
    if (!val || val.length < 6 || val.length > 50) {
      alert('Enter a valid ID (6–50 chars)');
      return;
    }
    try {
      const res = await fetch('/api/auth/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: val })
      });
      if (res.ok) {
        // Only update localStorage if server accepted the ID
        localStorage.setItem('quiz-user-id', val);
        window.location.reload();
        return;
      }
      if (res.status === 404) {
        // ID doesn't exist - don't change anything
        alert('This ID does not exist on the server. Your current ID remains active.\n\nNote: IDs are only created when you generate a quiz using the API mode (not BYOK).');
        setEditing(false);
        return;
      }
      alert('Server unavailable or cannot change ID right now.');
    } catch {
      alert('Server unavailable. Cannot change ID right now.');
    }
  };

  const shortId = userId ? `${userId.slice(0, 6)}…${userId.slice(-4)}` : '—';

  return (
    <div ref={menuRef} className="fixed top-3 right-3 z-50">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 rounded-full bg-white/80 backdrop-blur border border-stone-200 px-3 py-2 text-sm text-stone-700 hover:bg-white"
        aria-label="Account"
      >
        <User2 className="w-4 h-4 text-stone-600" />
        <span className="hidden md:inline">{shortId}</span>
        <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
      </button>

      {open && (
        <div
          className="mt-2 w-72 rounded-xl border border-stone-200 bg-white/95 backdrop-blur shadow-lg p-3"
          onPointerDownCapture={(e) => {
            // Ensure inside interactions never bubble to any global outside-closer
            e.stopPropagation();
          }}
        >
          <div className="mb-3">
            <p className="text-[10px] uppercase tracking-wide text-stone-500 mb-1">Your ID</p>
            {!editing ? (
              <>
                <button
                  onClick={handleCopy}
                  className="w-full text-left font-mono text-xs text-stone-800 truncate rounded-lg border border-stone-200 bg-white px-3 py-2 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  title="Click to copy"
                >
                  {userId}
                </button>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm bg-white border border-stone-200 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  >
                    <Pencil className="w-4 h-4 text-stone-700" />
                    <span>Sync with ID</span>
                  </button>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm bg-white border border-stone-200 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-green-300"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-700" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-stone-700" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <input
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  placeholder="Paste your existing ID to sync"
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setEditing(false)}
                    className="text-xs text-stone-600 hover:underline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveId}
                    className="rounded-md bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-700"
                  >
                    Save & Sync
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-stone-200 my-2" />

          <div className="flex items-center justify-between">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-stone-700 hover:text-stone-900"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repo</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}


