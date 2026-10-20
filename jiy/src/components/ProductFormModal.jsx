import React, { useState, useEffect } from "react";
import {
  translations,
  sampleImageLabels,
  getLocalizedCategory,
} from "../i18n/translations";

export default function ProductFormModal({
  isOpen,
  onClose,
  onSave,
  editingProduct,
  categories,
  lang = "ru",
}) {
  const t = translations[lang] || translations.ru;
  const samples = sampleImageLabels[lang] || sampleImageLabels.ru;

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    room: categories[0] || "",
    image: "",
    description: "",
    size: "",
    color: "",
    material: "",
    origin: "",
  });

  const [customCategory, setCustomCategory] = useState("");
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || "",
        price: editingProduct.price || "",
        room: editingProduct.room || categories[0] || "",
        image: editingProduct.image || "",
        description: editingProduct.description || "",
        size: editingProduct.size || "",
        color: editingProduct.color || "",
        material: editingProduct.material || "",
        origin: editingProduct.origin || "",
      });
      setIsNewCategory(false);
    } else {
      setFormData({
        name: "",
        price: "",
        room: categories[0] || "",
        image: samples[0]?.url || "",
        description: "",
        size: "",
        color: "",
        material: "",
        origin: "",
      });
      setIsNewCategory(false);
    }
    setError("");
  }, [editingProduct, isOpen, categories, lang]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError(t.validationNameError);
      return;
    }
    const numericPrice = Number(formData.price);
    if (!formData.price || isNaN(numericPrice) || numericPrice <= 0) {
      setError(t.validationPriceError);
      return;
    }
    const finalRoom = isNewCategory ? customCategory.trim() : formData.room;
    if (!finalRoom) {
      setError(t.validationCategoryError);
      return;
    }
    if (!formData.image.trim()) {
      setError(t.validationImageError);
      return;
    }

    onSave(
      {
        ...formData,
        price: numericPrice,
        room: finalRoom,
        id: editingProduct ? editingProduct.id : Date.now(),
      },
      isNewCategory ? customCategory.trim() : null,
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FFFFF0] border-2 border-[#D4AF37] shadow-2xl max-w-lg w-full p-6 relative rounded-sm my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#0d352f] hover:text-[#174b40] text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#E5E0D8] transition"
        >
          ✕
        </button>

        <h2 className="font-serif text-2xl text-[#0d352f] font-bold mb-4 border-b border-[#E5E0D8] pb-3">
          {editingProduct ? t.modalEditTitle : t.modalAddTitle}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-600 text-red-800 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-[#0d352f] mb-1">
              {t.productName} *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder={t.productNamePlaceholder}
              className="w-full px-3 py-2 bg-white border border-[#b6c8be] rounded-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d352f] text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#0d352f] mb-1">
                {t.productPrice} *
              </label>
              <input
                type="number"
                min="1"
                step="any"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="120"
                className="w-full px-3 py-2 bg-white border border-[#b6c8be] rounded-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d352f] text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#0d352f] mb-1">
                {t.productCategory} *
              </label>
              {!isNewCategory ? (
                <div className="flex gap-2">
                  <select
                    value={formData.room}
                    onChange={(e) =>
                      setFormData({ ...formData, room: e.target.value })
                    }
                    className="flex-1 px-3 py-2 bg-white border border-[#b6c8be] rounded-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d352f] text-sm"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {getLocalizedCategory(c, lang)}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsNewCategory(true)}
                    className="px-2.5 py-1 bg-[#0d352f] text-[#D4AF37] text-xs font-semibold rounded-sm hover:bg-[#174b40]"
                    title="Add new category"
                  >
                    {t.newCategoryBtn}
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder={t.newCategoryPlaceholder}
                    className="flex-1 px-3 py-2 bg-white border border-[#C5A059] rounded-sm text-stone-900 focus:outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setIsNewCategory(false)}
                    className="px-2 py-1 bg-stone-200 text-stone-800 text-xs rounded-sm hover:bg-stone-300"
                  >
                    {t.cancel}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-[#0d352f] mb-1">
              {t.imageLink} *
            </label>
            <input
              type="url"
              required
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              placeholder={t.imagePlaceholder}
              className="w-full px-3 py-2 bg-white border border-[#b6c8be] rounded-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d352f] text-sm"
            />

            {/* Quick sample image picker */}
            <div className="mt-2">
              <span className="text-[11px] text-stone-600 block mb-1">
                {t.sampleImagesPrompt}
              </span>
              <div className="flex flex-wrap gap-1">
                {samples.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, image: img.url })}
                    className="px-2 py-1 bg-[#EBE5DC] hover:bg-[#D4AF37] hover:text-[#0d352f] text-stone-800 rounded text-[11px] transition"
                  >
                    {img.label}
                  </button>
                ))}
              </div>
            </div>

            {formData.image && (
              <div className="mt-2 flex items-center gap-3 p-2 bg-[#F4EFE6] border border-[#E5E0D8] rounded">
                <img
                  src={formData.image}
                  alt={t.imagePreview}
                  className="w-16 h-16 object-cover border border-[#C5A059]"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/150?text=No+Image";
                  }}
                />
                <span className="text-stone-600 text-xs">{t.imagePreview}</span>
              </div>
            )}
          </div>

          {/* Specifications: Size & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#0d352f] mb-1">
                {t.specSize}
              </label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
                placeholder={t.specSizePlaceholder}
                className="w-full px-3 py-2 bg-white border border-[#b6c8be] rounded-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d352f] text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#0d352f] mb-1">
                {t.specColor}
              </label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                placeholder={t.specColorPlaceholder}
                className="w-full px-3 py-2 bg-white border border-[#b6c8be] rounded-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d352f] text-sm"
              />
            </div>
          </div>

          {/* Specifications: Material & Origin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#0d352f] mb-1">
                {t.specMaterial}
              </label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) =>
                  setFormData({ ...formData, material: e.target.value })
                }
                placeholder={t.specMaterialPlaceholder}
                className="w-full px-3 py-2 bg-white border border-[#b6c8be] rounded-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d352f] text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#0d352f] mb-1">
                {t.specOrigin}
              </label>
              <input
                type="text"
                value={formData.origin}
                onChange={(e) =>
                  setFormData({ ...formData, origin: e.target.value })
                }
                placeholder={t.specOriginPlaceholder}
                className="w-full px-3 py-2 bg-white border border-[#b6c8be] rounded-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d352f] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-[#0d352f] mb-1">
              {t.description}
            </label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder={t.descriptionPlaceholder}
              className="w-full px-3 py-2 bg-white border border-[#b6c8be] rounded-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0d352f] text-sm"
            />
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
              className="px-6 py-2 bg-[#0d352f] text-[#D4AF37] border border-[#D4AF37] text-xs font-bold uppercase tracking-wider hover:bg-[#174b40] transition rounded-sm shadow"
            >
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
