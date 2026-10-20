import React, { useState } from "react";
import { translations, getLocalizedCategory } from "../i18n/translations";

export default function AdminDashboard({
  products,
  categories,
  orders,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onDeleteOrder,
  onAddCategory,
  onDeleteCategory,
  onSwitchToShop,
  onLogout,
  onViewProduct,
  lang = "ru",
  onChangeLang,
}) {
  const t = translations[lang] || translations.ru;

  const [activeTab, setActiveTab] = useState("products"); // 'products', 'orders', 'categories'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [newCatInput, setNewCatInput] = useState("");
  const [orderFilter, setOrderFilter] = useState("all");

  // Stats
  const totalRevenue = orders
    .filter(
      (o) =>
        o.status !== t.statusCancelled &&
        o.status !== "Bekor qilindi" &&
        o.status !== "Отменен" &&
        o.status !== "Cancelled",
    )
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const pendingOrdersCount = orders.filter(
    (o) =>
      o.status === "Новый" ||
      o.status === "New" ||
      o.status === "Yangi" ||
      o.status === t.statusNew,
  ).length;

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const pName =
      lang === "en" && p.name_en
        ? p.name_en
        : lang === "uz" && p.name_uz
          ? p.name_uz
          : p.name;
    const pDesc =
      lang === "en" && p.description_en
        ? p.description_en
        : lang === "uz" && p.description_uz
          ? p.description_uz
          : p.description;
    const matchesSearch =
      pName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pDesc && pDesc.toLowerCase().includes(searchQuery.toLowerCase()));
    const pRoom =
      lang === "en" && p.room_en
        ? p.room_en
        : lang === "uz" && p.room_uz
          ? p.room_uz
          : p.room;
    const matchesCat =
      selectedCategoryFilter === "all" ||
      pRoom === selectedCategoryFilter ||
      p.room === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === "all") return true;
    return o.status === orderFilter;
  });

  const handleAddNewCategory = (e) => {
    e.preventDefault();
    if (newCatInput.trim()) {
      onAddCategory(newCatInput.trim());
      setNewCatInput("");
    }
  };

  const getLocalizedName = (p) => {
    if (lang === "en" && p.name_en) return p.name_en;
    if (lang === "uz" && p.name_uz) return p.name_uz;
    return p.name;
  };

  const getLocalizedDesc = (p) => {
    if (lang === "en" && p.description_en) return p.description_en;
    if (lang === "uz" && p.description_uz) return p.description_uz;
    return p.description;
  };

  const getLocalizedRoom = (p) => {
    if (lang === "en" && p.room_en) return p.room_en;
    if (lang === "uz" && p.room_uz) return p.room_uz;
    return p.room;
  };

  return (
    <div className="min-h-screen bg-[#edf2ee] text-[#2C2C2C] flex flex-col font-sans">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-20 bg-[#0d352f] text-[#FFFFF0] px-4 sm:px-6 py-4 shadow-md flex flex-wrap justify-between items-center border-b-2 border-[#D4AF37] gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-serif tracking-wider text-[#D4AF37]">
            ATELIER
          </h1>
          <span className="bg-[#D4AF37] text-[#0d352f] text-xs font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
            {t.adminBadge}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Language Switcher in Admin Header */}
          <div className="flex items-center bg-[#092c27] border border-[#D4AF37]/50 rounded-full p-0.5 text-xs">
            <button
              onClick={() => onChangeLang("ru")}
              className={`px-2.5 py-1 rounded-full transition font-semibold ${
                lang === "ru"
                  ? "bg-[#D4AF37] text-[#0d352f]"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              RU
            </button>
            <button
              onClick={() => onChangeLang("en")}
              className={`px-2.5 py-1 rounded-full transition font-semibold ${
                lang === "en"
                  ? "bg-[#D4AF37] text-[#0d352f]"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onChangeLang("uz")}
              className={`px-2.5 py-1 rounded-full transition font-semibold ${
                lang === "uz"
                  ? "bg-[#D4AF37] text-[#0d352f]"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              UZ
            </button>
          </div>

          <button
            onClick={onSwitchToShop}
            className="px-3.5 py-1.5 bg-transparent border border-[#D4AF37] text-[#FFFFF0] hover:bg-[#D4AF37] hover:text-[#0d352f] transition text-xs uppercase font-semibold tracking-wider rounded-sm flex items-center gap-1.5"
          >
            <span>👁️</span> {t.storefront}
          </button>
          <button
            onClick={onLogout}
            className="px-3.5 py-1.5 bg-red-900/80 hover:bg-red-800 text-white border border-red-700 transition text-xs uppercase font-semibold tracking-wider rounded-sm flex items-center gap-1.5"
          >
            <span>🚪</span> {t.logout}
          </button>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 w-full flex-1">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#f8f8f4] border-l-4 border-l-[#D4AF37] border-t border-r border-b border-[#E5E0D8] p-4 shadow-sm">
            <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
              {t.adminStatsProducts}
            </span>
            <div className="text-2xl font-bold font-serif text-[#0d352f] mt-1">
              {products.length}
            </div>
            <span className="text-[11px] text-stone-500">
              {t.byCategories.replace("{count}", categories.length)}
            </span>
          </div>

          <div className="bg-[#f8f8f4] border-l-4 border-l-amber-600 border-t border-r border-b border-[#E5E0D8] p-4 shadow-sm">
            <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
              {t.adminStatsOrders}
            </span>
            <div className="text-2xl font-bold font-serif text-[#0d352f] mt-1">
              {orders.length}
            </div>
            <span className="text-[11px] text-amber-700 font-medium">
              {t.newOrdersBadge.replace("{count}", pendingOrdersCount)}
            </span>
          </div>

          <div className="bg-[#f8f8f4] border-l-4 border-l-emerald-600 border-t border-r border-b border-[#E5E0D8] p-4 shadow-sm">
            <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
              {t.adminStatsRevenue}
            </span>
            <div className="text-2xl font-bold font-serif text-emerald-800 mt-1">
              ${totalRevenue.toLocaleString()}
            </div>
            <span className="text-[11px] text-stone-500">
              {t.fromActiveOrders}
            </span>
          </div>

          <div className="bg-[#f8f8f4] border-l-4 border-l-[#0d352f] border-t border-r border-b border-[#E5E0D8] p-4 shadow-sm">
            <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
              {t.adminStatsCategories}
            </span>
            <div className="text-2xl font-bold font-serif text-[#0d352f] mt-1">
              {categories.length}
            </div>
            <span className="text-[11px] text-stone-500">{t.catalogTypes}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E5E0D8] mb-6 gap-2">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-5 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider transition border-b-2 flex items-center gap-2 ${
              activeTab === "products"
                ? "border-[#0d352f] text-[#0d352f] bg-[#f8f8f4]"
                : "border-transparent text-stone-600 hover:text-[#0d352f]"
            }`}
          >
            <span>🛍️</span> {t.tabProducts} ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider transition border-b-2 flex items-center gap-2 relative ${
              activeTab === "orders"
                ? "border-[#0d352f] text-[#0d352f] bg-[#f8f8f4]"
                : "border-transparent text-stone-600 hover:text-[#0d352f]"
            }`}
          >
            <span>📦</span> {t.tabOrders} ({orders.length})
            {pendingOrdersCount > 0 && (
              <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1">
                {pendingOrdersCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-5 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider transition border-b-2 flex items-center gap-2 ${
              activeTab === "categories"
                ? "border-[#0d352f] text-[#0d352f] bg-[#f8f8f4]"
                : "border-transparent text-stone-600 hover:text-[#0d352f]"
            }`}
          >
            <span>📂</span> {t.tabCategories} ({categories.length})
          </button>
        </div>

        {/* TAB 1: PRODUCTS MANAGEMENT */}
        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#f8f8f4] p-4 border border-[#E5E0D8]">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder={t.searchProductsPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-2 bg-white border border-[#C5A059] rounded-sm text-xs text-stone-900 w-full sm:w-64 focus:outline-none"
                />
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-white border border-[#C5A059] rounded-sm text-xs text-stone-900 focus:outline-none"
                >
                  <option value="all">{t.filterAllCategories}</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {getLocalizedCategory(c, lang)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={onAddProduct}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#0d352f] text-[#D4AF37] border border-[#D4AF37] font-semibold text-xs uppercase tracking-wider hover:bg-[#174b40] transition rounded-sm flex items-center justify-center gap-1.5 shadow"
              >
                <span>➕</span> {t.addProduct}
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-[#f8f8f4] border border-[#E5E0D8] shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#e5eee9] border-b border-[#E5E0D8] text-stone-700 uppercase font-semibold">
                    <th className="p-3 w-16">{t.tableImage}</th>
                    <th className="p-3">{t.tableNameDesc}</th>
                    <th className="p-3">{t.tableCategory}</th>
                    <th className="p-3">{t.tablePrice}</th>
                    <th className="p-3 text-right">{t.tableActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E0D8]">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-8 text-center text-stone-500"
                      >
                        {t.noProductsFound}
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#edf2ee] transition">
                        <td className="p-3">
                          <img
                            src={p.image}
                            alt={getLocalizedName(p)}
                            className="w-12 h-12 object-cover border border-[#E5E0D8] rounded"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/60?text=No+Img";
                            }}
                          />
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-sm text-[#0d352f]">
                            {getLocalizedName(p)}
                          </div>
                          {getLocalizedDesc(p) && (
                            <div className="text-stone-500 text-[11px] truncate max-w-xs">
                              {getLocalizedDesc(p)}
                            </div>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="px-2.5 py-1 bg-[#F4EFE6] border border-[#C5A059] rounded text-[11px] font-medium text-stone-800">
                            {getLocalizedCategory(getLocalizedRoom(p), lang)}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-[#D4AF37] text-sm">
                          ${p.price}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => onViewProduct && onViewProduct(p)}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-medium transition"
                              title={t.viewDetails}
                            >
                              👁️
                            </button>
                            <button
                              onClick={() => onEditProduct(p)}
                              className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded font-medium transition"
                            >
                              {t.edit}
                            </button>
                            <button
                              onClick={() => onDeleteProduct(p.id)}
                              className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded font-medium transition"
                            >
                              {t.delete}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#f8f8f4] p-4 border border-[#E5E0D8]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-600 uppercase">
                  {t.filterOrders}
                </span>
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-[#C5A059] rounded text-xs text-stone-900 focus:outline-none"
                >
                  <option value="all">{t.filterAllOrders}</option>
                  <option value={t.statusNew}>{t.filterOnlyNew}</option>
                  <option value={t.statusProcessing}>
                    {t.filterProcessing}
                  </option>
                  <option value={t.statusDelivered}>{t.filterDelivered}</option>
                  <option value={t.statusCancelled}>{t.filterCancelled}</option>
                </select>
              </div>

              <div className="text-xs text-stone-600">
                {t.totalOrdersCount.replace("{count}", filteredOrders.length)}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-[#f8f8f4] p-8 text-center text-stone-500 border border-[#E5E0D8]">
                {t.noOrdersFound}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredOrders.map((order) => {
                  const isNew =
                    order.status === "Новый" ||
                    order.status === "New" ||
                    order.status === "Yangi" ||
                    order.status === t.statusNew;
                  const isDelivered =
                    order.status === "Доставлен" ||
                    order.status === "Delivered" ||
                    order.status === "Yetkazildi" ||
                    order.status === t.statusDelivered;
                  const isProcessing =
                    order.status === "В процессе" ||
                    order.status === "Processing" ||
                    order.status === "Jarayonda" ||
                    order.status === t.statusProcessing;

                  return (
                    <div
                      key={order.id}
                      className="bg-[#f8f8f4] border border-[#E5E0D8] p-5 shadow-sm rounded-none hover:border-[#D4AF37] transition"
                    >
                      <div className="flex flex-wrap justify-between items-start gap-3 border-b border-[#E5E0D8] pb-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-base text-[#0d352f]">
                              {order.id}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-[11px] font-bold uppercase rounded ${
                                isNew
                                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                                  : isDelivered
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                    : isProcessing
                                      ? "bg-blue-100 text-blue-800 border border-blue-300"
                                      : "bg-stone-200 text-stone-700"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <span className="text-[11px] text-stone-500">
                            {order.date}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-[11px] text-stone-500 block">
                              {t.totalAmount}
                            </span>
                            <span className="font-serif font-bold text-lg text-[#D4AF37]">
                              ${order.totalPrice}
                            </span>
                          </div>

                          <button
                            onClick={() => onDeleteOrder(order.id)}
                            className="px-2.5 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded transition"
                            title={t.deleteOrder}
                          >
                            ✕ {t.delete}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {/* Customer info */}
                        <div className="bg-[#edf2ee] p-3 rounded border border-[#E5E0D8] space-y-1">
                          <div className="font-semibold text-stone-800 uppercase tracking-wider text-[11px]">
                            {t.customerData}
                          </div>
                          <p className="text-stone-900 font-medium">
                            👤 {order.customerName}
                          </p>
                          <p className="text-stone-700">
                            📞{" "}
                            <a
                              href={`tel:${order.phone}`}
                              className="underline text-[#0d352f]"
                            >
                              {order.phone}
                            </a>
                          </p>
                          <p className="text-stone-700">📍 {order.address}</p>
                          {order.notes && (
                            <p className="text-stone-600 italic">
                              💬 {order.notes}
                            </p>
                          )}
                        </div>

                        {/* Items & status update */}
                        <div className="space-y-3 flex flex-col justify-between">
                          <div>
                            <div className="font-semibold text-stone-800 uppercase tracking-wider text-[11px] mb-1">
                              {t.orderedProducts}
                            </div>
                            <ul className="space-y-1">
                              {order.items &&
                                order.items.map((item, idx) => (
                                  <li
                                    key={idx}
                                    className="flex justify-between text-stone-700 border-b border-[#E5E0D8] pb-1"
                                  >
                                    <span>• {item.name}</span>
                                    <span className="font-semibold text-[#D4AF37]">
                                      ${item.price}
                                    </span>
                                  </li>
                                ))}
                            </ul>
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <label className="text-xs font-semibold text-stone-700">
                              {t.changeStatus}
                            </label>
                            <select
                              value={order.status}
                              onChange={(e) =>
                                onUpdateOrderStatus(order.id, e.target.value)
                              }
                              className="px-2 py-1 bg-white border border-[#C5A059] rounded text-xs font-medium text-stone-900 focus:outline-none"
                            >
                              <option value={t.statusNew}>{t.statusNew}</option>
                              <option value={t.statusProcessing}>
                                {t.statusProcessing}
                              </option>
                              <option value={t.statusDelivered}>
                                {t.statusDelivered}
                              </option>
                              <option value={t.statusCancelled}>
                                {t.statusCancelled}
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CATEGORIES MANAGEMENT */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="bg-[#f8f8f4] border border-[#E5E0D8] p-5 shadow-sm">
              <h3 className="font-serif text-lg text-[#0d352f] font-bold mb-3 border-l-4 border-[#D4AF37] pl-3">
                {t.addNewCategoryTitle}
              </h3>
              <form
                onSubmit={handleAddNewCategory}
                className="flex flex-col sm:flex-row gap-3 max-w-md"
              >
                <input
                  type="text"
                  placeholder={t.newCategoryInputPlaceholder}
                  value={newCatInput}
                  onChange={(e) => setNewCatInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-[#C5A059] rounded-sm text-xs text-stone-900 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0d352f] text-[#D4AF37] border border-[#D4AF37] font-semibold text-xs uppercase tracking-wider hover:bg-[#174b40] transition rounded-sm"
                >
                  {t.addBtn}
                </button>
              </form>
            </div>

            <div className="bg-[#f8f8f4] border border-[#E5E0D8] p-5 shadow-sm">
              <h3 className="font-serif text-lg text-[#0d352f] font-bold mb-4 border-l-4 border-[#D4AF37] pl-3">
                {t.existingCategories}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((cat) => {
                  const productCount = products.filter(
                    (p) =>
                      p.room === cat || p.room_en === cat || p.room_uz === cat,
                  ).length;
                  return (
                    <div
                      key={cat}
                      className="p-4 bg-[#edf2ee] border border-[#E5E0D8] flex justify-between items-center"
                    >
                      <div>
                        <h4 className="font-serif text-sm font-bold text-[#0d352f]">
                          {getLocalizedCategory(cat, lang)}
                        </h4>
                        <p className="text-[11px] text-stone-500">
                          {t.productsCount.replace("{count}", productCount)}
                        </p>
                      </div>
                      <button
                        onClick={() => onDeleteCategory(cat)}
                        className="px-2.5 py-1 text-xs bg-red-100 text-red-800 hover:bg-red-200 rounded transition"
                        title={t.delete}
                      >
                        {t.delete}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
