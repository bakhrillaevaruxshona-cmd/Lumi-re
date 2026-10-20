import React from 'react';
import { translations, getLocalizedCategory } from '../i18n/translations';

export default function ProductDetailsModal({ isOpen, product, onClose, onAddToCart, lang = 'ru' }) {
  if (!isOpen || !product) return null;

  const t = translations[lang] || translations.ru;

  const getName = () => {
    if (lang === 'en' && product.name_en) return product.name_en;
    if (lang === 'uz' && product.name_uz) return product.name_uz;
    return product.name;
  };

  const getDesc = () => {
    if (lang === 'en' && product.description_en) return product.description_en;
    if (lang === 'uz' && product.description_uz) return product.description_uz;
    return product.description;
  };

  const getRoom = () => {
    if (lang === 'en' && product.room_en) return product.room_en;
    if (lang === 'uz' && product.room_uz) return product.room_uz;
    return product.room;
  };

  const getSize = () => {
    if (lang === 'en' && product.size_en) return product.size_en;
    if (lang === 'uz' && product.size_uz) return product.size_uz;
    return product.size || (lang === 'en' ? 'Standard / Universal' : lang === 'uz' ? 'Standart / Universal' : 'Стандартный / Универсальный');
  };

  const getColor = () => {
    if (lang === 'en' && product.color_en) return product.color_en;
    if (lang === 'uz' && product.color_uz) return product.color_uz;
    return product.color || (lang === 'en' ? 'Original palette' : lang === 'uz' ? 'Klassik rang' : 'Оригинальный оттенок');
  };

  const getMaterial = () => {
    if (lang === 'en' && product.material_en) return product.material_en;
    if (lang === 'uz' && product.material_uz) return product.material_uz;
    return product.material || (lang === 'en' ? 'Premium Quality' : lang === 'uz' ? 'Oliy sifatli material' : 'Премиальное качество');
  };

  const getOrigin = () => {
    if (lang === 'en' && product.origin_en) return product.origin_en;
    if (lang === 'uz' && product.origin_uz) return product.origin_uz;
    return product.origin || (lang === 'en' ? 'Europe / Imported' : lang === 'uz' ? 'Yevropa / Eksklyuziv' : 'Европа / Импорт');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FFFFF0] border-2 border-[#D4AF37] shadow-2xl max-w-3xl w-full relative rounded-sm my-6 overflow-hidden flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 text-[#58111A] hover:text-[#721C24] text-xl font-bold w-9 h-9 flex items-center justify-center rounded-full bg-white/80 hover:bg-[#E5E0D8] transition shadow-md"
          title="Yopish / Закрыть"
        >
          ✕
        </button>

        {/* Left: Product Image */}
        <div className="md:w-1/2 bg-stone-100 relative min-h-[300px] md:min-h-[460px] flex items-center justify-center overflow-hidden group">
          <img
            src={product.image}
            alt={getName()}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500';
            }}
          />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <span className="bg-[#58111A] text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow">
              {getLocalizedCategory(getRoom(), lang)}
            </span>
            <span className="bg-[#D4AF37] text-[#58111A] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
              {t.originBadge}
            </span>
          </div>
        </div>

        {/* Right: Detailed Information */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-baseline gap-2 mb-2">
              <span className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                ATELIER LUXURY
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                {t.inStock}
              </span>
            </div>

            <h2 className="font-serif text-2xl font-bold text-[#58111A] leading-tight">
              {getName()}
            </h2>

            <div className="mt-2 mb-4 pb-3 border-b border-[#E5E0D8] flex items-center gap-3">
              <span className="text-2xl font-bold text-[#D4AF37] font-serif">
                ${product.price}
              </span>
              <span className="text-xs text-stone-500 line-through">
                ${Math.round(product.price * 1.25)}
              </span>
              <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded">
                -20%
              </span>
            </div>

            {/* Description */}
            {getDesc() && (
              <p className="text-xs text-stone-700 mb-5 leading-relaxed italic bg-[#F8F5EE] p-3 border-l-2 border-[#D4AF37] rounded-r">
                "{getDesc()}"
              </p>
            )}

            {/* Product Specifications Table */}
            <div className="space-y-3 mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#58111A] border-b border-[#E5E0D8] pb-1">
                {t.specsTitle}
              </h3>

              <div className="grid grid-cols-1 gap-2.5 text-xs">
                {/* 1. O'lchami / Размер */}
                <div className="flex items-start justify-between py-1 border-b border-[#E5E0D8]/60">
                  <span className="text-stone-500 font-medium flex items-center gap-1.5">
                    <span>📏</span> {t.specSize}:
                  </span>
                  <span className="font-semibold text-stone-900 text-right max-w-[55%]">
                    {getSize()}
                  </span>
                </div>

                {/* 2. Rangi / Цвет */}
                <div className="flex items-start justify-between py-1 border-b border-[#E5E0D8]/60">
                  <span className="text-stone-500 font-medium flex items-center gap-1.5">
                    <span>🎨</span> {t.specColor}:
                  </span>
                  <span className="font-semibold text-stone-900 text-right max-w-[55%]">
                    {getColor()}
                  </span>
                </div>

                {/* 3. Sifati / Качество и материал */}
                <div className="flex items-start justify-between py-1 border-b border-[#E5E0D8]/60">
                  <span className="text-stone-500 font-medium flex items-center gap-1.5">
                    <span>💎</span> {t.specMaterial}:
                  </span>
                  <span className="font-semibold text-[#58111A] text-right max-w-[55%]">
                    {getMaterial()}
                  </span>
                </div>

                {/* 4. Qayerdan kelgani / Страна производства */}
                <div className="flex items-start justify-between py-1 border-b border-[#E5E0D8]/60">
                  <span className="text-stone-500 font-medium flex items-center gap-1.5">
                    <span>🌍</span> {t.specOrigin}:
                  </span>
                  <span className="font-bold text-[#D4AF37] bg-[#58111A] px-2 py-0.5 rounded text-[11px] text-right">
                    {getOrigin()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action button inside details */}
          <div className="space-y-2 pt-2 border-t border-[#E5E0D8]">
            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="w-full py-3 bg-[#58111A] text-[#FFFFF0] hover:bg-[#721C24] transition text-xs uppercase font-bold tracking-wider rounded-sm flex items-center justify-center gap-2 shadow"
            >
              <span>🛍️</span> {t.addToCart} (${product.price})
            </button>
            <p className="text-[11px] text-center text-stone-500 flex items-center justify-center gap-1">
              <span>✨</span> {t.freeDeliveryBadge}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
