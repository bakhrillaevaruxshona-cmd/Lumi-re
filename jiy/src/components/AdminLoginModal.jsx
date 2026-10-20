import { useState } from "react";
import { translations } from "../i18n/translations";

export default function AdminLoginModal({
  isOpen,
  onClose,
  onLogin,
  lang = "ru",
}) {
  const t = translations[lang] || translations.ru;
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "admin123") {
      onLogin();
      setPassword("");
      setError("");
    } else {
      setError(t.wrongPassword);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FFFFF0] border-2 border-[#D4AF37] shadow-2xl max-w-md w-full p-6 relative rounded-sm animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#0d352f] hover:text-[#174b40] text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#E5E0D8] transition"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#0d352f] text-[#D4AF37] mb-3 shadow-inner">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="font-serif text-2xl text-[#0d352f] font-bold">
            {t.loginTitle}
          </h2>
          <p className="text-xs text-stone-600 mt-1">{t.loginSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#0d352f] mb-1.5">
              {t.passwordLabel}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder={t.passwordPlaceholder}
                className="w-full px-4 py-2.5 bg-white border border-[#b6c8be] rounded-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d352f] pr-12 text-sm"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-stone-500 hover:text-stone-800 text-xs"
              >
                {showPassword ? t.hide : t.show}
              </button>
            </div>
            {error && (
              <p className="text-red-700 text-xs mt-1.5 font-medium">{error}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-[#0d352f] text-[#D4AF37] border border-[#D4AF37] font-semibold text-sm uppercase tracking-wider hover:bg-[#174b40] transition shadow"
            >
              {t.enter}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
