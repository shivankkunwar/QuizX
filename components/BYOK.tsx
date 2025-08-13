'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';

type CtxType = {
  byokKey: string;
  isBYOK: boolean;
  openModal: () => void;
  closeModal: () => void;
  setKey: (k: string) => void;
  clearKey: () => void;
};

const BYOKCtx = createContext<CtxType | undefined>(undefined);

export function BYOKProvider({ children }: { children: React.ReactNode }) {
  const [byokKey, setByokKey] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const k = localStorage.getItem('gemini-api-key') || '';
    setByokKey(k);
  }, []);

  const setKey = (k: string) => {
    setByokKey(k);
    if (k) localStorage.setItem('gemini-api-key', k);
    else localStorage.removeItem('gemini-api-key');
  };
  const clearKey = () => setKey('');

  return (
    <BYOKCtx.Provider
      value={{
        byokKey,
        isBYOK: !!byokKey,
        openModal: () => setIsModalOpen(true),
        closeModal: () => setIsModalOpen(false),
        setKey,
        clearKey
      }}
    >
      {children}
      {isModalOpen && (
        <BYOKModal
          initial={byokKey}
          onClose={() => setIsModalOpen(false)}
          onSave={(k) => {
            setKey(k.trim());
            setIsModalOpen(false);
          }}
        />
      )}
    </BYOKCtx.Provider>
  );
}

export function useBYOK() {
    const ctx = useContext(BYOKCtx);
    if (!ctx) throw new Error('useBYOK must be used within BYOKProvider');
    return ctx;
  }
function BYOKModal({
    onClose,
    onSave,
    initial
  }: {
    onClose: () => void;
    onSave: (k: string) => void;
    initial?: string;
  }) {
    const [key, setKey] = useState(initial || '');
    const [isPasting, setIsPasting] = useState(false);
  
    const handlePaste = async () => {
      try {
        setIsPasting(true);
        const text = await navigator.clipboard.readText();
        setKey(text);
      } finally {
        setIsPasting(false);
      }
    };
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="w-full max-w-md rounded-2xl border border-orange-200 bg-white/90 shadow-xl">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="text-sm font-semibold text-stone-800">Enter Gemini API Key</h2>
            <button onClick={onClose} className="text-stone-500 hover:text-stone-700">×</button>
          </div>
          <div className="px-5 pb-5">
            <input
              type="password"
              placeholder="sk-..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full rounded-lg border border-orange-200 bg-white/80 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <div className="mt-3 flex items-center justify-between">
              <button onClick={handlePaste} className="text-xs text-orange-700 hover:underline" disabled={isPasting}>
                {isPasting ? 'Pasting…' : 'Paste from clipboard'}
              </button>
              <div className="space-x-2">
                <button onClick={onClose} className="rounded-md px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100">Cancel</button>
                <button onClick={() => onSave(key)} disabled={!key.trim()} className="rounded-md bg-orange-600 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-700 disabled:opacity-50">Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }