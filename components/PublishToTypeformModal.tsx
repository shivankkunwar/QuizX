'use client';

import { useEffect, useMemo, useState } from 'react';
import { createTypeformFromQuiz } from './TypeformConnect';

export default function PublishToTypeformModal({
    open,
    initial,
    onClose
}: {
    open: boolean;
    initial: any | null;
    onClose: () => void;
}) {
    const [text, setText] = useState('');
    const [busy, setBusy] = useState(false);
    const [includeEmail, setIncludeEmail] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open && initial) {
            try {
                setText(JSON.stringify(initial, null, 2));
                setError(null);
            } catch {
                setText('');
            }
        }
    }, [open, initial]);

    const hasParseError = useMemo(() => {
        try {
            JSON.parse(text);
            return false;
        } catch {
            return true;
        }
    }, [text]);

    const handleReset = () => {
        if (!initial) return;
        setText(JSON.stringify(initial, null, 2));
        setError(null);
    };

    const handleBeautify = () => {
        try {
            const obj = JSON.parse(text);
            setText(JSON.stringify(obj, null, 2));
            setError(null);
        } catch (e: any) {
            setError('Invalid JSON');
        }
    };

    const handleMinify = () => {
        try {
            const obj = JSON.parse(text);
            setText(JSON.stringify(obj));
            setError(null);
        } catch (e: any) {
            setError('Invalid JSON');
        }
    };

    const handleCreate = async () => {
        setError(null);
        if (hasParseError) {
            setError('Please fix JSON before creating.');
            return;
        }
        let payload: any;
        try {
            payload = JSON.parse(text);
        } catch {
            setError('Invalid JSON');
            return;
        }
        setBusy(true);
        try {
            const created = await createTypeformFromQuiz(payload, { includeEmailField: includeEmail });
            if (created?.shareUrl) {
                try { window.open(created.shareUrl, '_blank'); } catch { }
            }
            onClose();
        } catch (e: any) {
            setError(String(e?.message || e) || 'Failed to create form');
        } finally {
            setBusy(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/30" onClick={() => { if (!busy) onClose(); }} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden relative">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200">
                        <h3 className="text-sm font-semibold text-stone-800">Publish to Typeform</h3>
                        <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-sm" disabled={busy}>Close</button>
                    </div>

                    <div className="flex flex-col md:flex-row h-[85vh] min-h-0">
                        <div className="md:w-1/5 w-full flex-none border-b md:border-b-0 md:border-r border-stone-200 p-3 space-y-2">
                            <button onClick={handleBeautify} className="w-full text-left px-3 py-2 rounded border border-stone-200 text-sm hover:bg-stone-50">Beautify</button>
                            <button onClick={handleMinify} className="w-full text-left px-3 py-2 rounded border border-stone-200 text-sm hover:bg-stone-50">Minify</button>
                            <button onClick={handleReset} className="w-full text-left px-3 py-2 rounded border border-stone-200 text-sm hover:bg-stone-50">Reset to default</button>

                            <label className="flex items-center gap-2 text-sm text-stone-700 px-1 pt-2">
                                <input
                                    type="checkbox"
                                    checked={includeEmail}
                                    onChange={(e) => setIncludeEmail(e.target.checked)}
                                />
                                Include email field
                            </label>

                            <div className="md:mt-auto pt-2 flex gap-2">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-3 py-2 rounded border border-stone-200 text-sm text-stone-700 hover:bg-stone-50"
                                    disabled={busy}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreate}
                                    className="flex-1 px-3 py-2 rounded bg-orange-600 text-white text-sm hover:bg-orange-700 disabled:opacity-60"
                                    disabled={busy || hasParseError}
                                >
                                    {busy ? 'Creating…' : 'Create'}
                                </button>
                            </div>

                            {error && <p className="text-xs text-red-600 px-1">{error}</p>}
                        </div>

                        <div className="md:w-4/5 w-full flex-1 min-h-0 p-3 overflow-hidden">
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full h-full resize-none overflow-auto font-mono text-[12px] leading-5 bg-white border border-stone-200 rounded p-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
                                spellCheck={false}
                            />
                        </div>
                    </div>
                    {busy && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                            <div className="w-10 h-10 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
