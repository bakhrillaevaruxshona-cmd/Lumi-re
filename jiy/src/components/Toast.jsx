import React from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded shadow-xl border animate-in slide-in-from-bottom duration-300 text-sm font-medium bg-[#58111A] text-[#FFFFF0] border-[#D4AF37]">
      <span>
        {type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ️'}
      </span>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-[#D4AF37] hover:text-white font-bold text-xs"
      >
        ✕
      </button>
    </div>
  );
}
