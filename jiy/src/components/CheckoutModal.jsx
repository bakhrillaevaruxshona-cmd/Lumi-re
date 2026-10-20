import React, { useState } from 'react';
import { translations } from '../i18n/translations';

export default function CheckoutModal({ isOpen, onClose, cart, totalPrice, onConfirmOrder, lang = 'ru' }) {
  const t = translations[lang] || translations.ru;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setError(t.requiredFieldsError);
      return;
    }

    const orderData = {
      id: 'ORD-' + Math.floor(100 + Math.random() * 900),
      customerName: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      notes: formData.notes.trim(),
      totalPrice: totalPrice,
      status: t.statusNew || 'Новый',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price
      }))
    };

    onConfirmOrder(orderData);
    setFormData({ name: '', phone: '', address: '', notes: '' });
    setError('');
    onClose();
  };

  const summaryText = t.checkoutSummary
    .replace('{count}', cart.length)
    .replace('{total}', totalPrice);

  const confirmBtnText = t.confirmOrder.replace('{total}', totalPrice);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FFFFF0] border-2 border-[#D4AF37] shadow-2xl max-w-lg w-full p-6 relative rounded-sm my-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#58111A] hover:text-[#721C24] text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#E5E0D8] transition"
        >
          ✕
        </button>

        <div className="mb-5 pb-3 border-b border-[#E5E0D8]">
          <h2 className="font-serif text-2xl text-[#58111A] font-bold">{t.checkoutTitle}</h2>
          <p className="text-xs text-stone-600 mt-1">{summaryText}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-600 text-red-800 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-[#58111A] mb-1">
              {t.fullName} *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t.fullNamePlaceholder}
              className="w-full px-3 py-2 bg-white border border-[#C5A059] rounded-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#58111A] text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-[#58111A] mb-1">
              {t.phone} *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder={t.phonePlaceholder}
              className="w-full px-3 py-2 bg-white border border-[#C5A059] rounded-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#58111A] text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-[#58111A] mb-1">
              {t.address} *
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder={t.addressPlaceholder}
              className="w-full px-3 py-2 bg-white border border-[#C5A059] rounded-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#58111A] text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-[#58111A] mb-1">
              {t.notes}
            </label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t.notesPlaceholder}
              className="w-full px-3 py-2 bg-white border border-[#C5A059] rounded-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#58111A] text-sm"
            />
          </div>

          <div className="bg-[#F8F5EE] p-3 rounded border border-[#E5E0D8]">
            <p className="text-[11px] text-stone-600">
              {t.orderNotice}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E0D8]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-200 text-stone-800 text-xs font-semibold uppercase tracking-wider hover:bg-stone-300 rounded-sm"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#58111A] text-[#D4AF37] border border-[#D4AF37] text-xs font-bold uppercase tracking-wider hover:bg-[#721C24] transition rounded-sm shadow"
            >
              {confirmBtnText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
