import { useEffect, useState } from "react";
import { getLocalizedCategory, translations } from "../i18n/translations";
import { getSubcategoryLabel } from "../data/initialData";
import Toast from "./Toast";

export default function ProductPage({
  product,
  products = [],
  lang,
  isLoading,
  onBack,
  onOpenProduct,
  onAddToCart,
  toast,
  onCloseToast,
}) {
  const t = translations[lang] || translations.ru;
  const [reviewStore, setReviewStore] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("atelier_product_reviews") || "{}",
      );
    } catch {
      return {};
    }
  });
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const reviews = product ? reviewStore[String(product.id)] || [] : [];
  const averageReviewRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  useEffect(() => {
    localStorage.setItem(
      "atelier_product_reviews",
      JSON.stringify(reviewStore),
    );
  }, [reviewStore]);

  const getLocalizedValue = (field) => {
    if (lang === "en" && product?.[`${field}_en`]) {
      return product[`${field}_en`];
    }
    if (lang === "uz" && product?.[`${field}_uz`]) {
      return product[`${field}_uz`];
    }
    return product?.[field];
  };

  const title = getLocalizedValue("name");
  const description = getLocalizedValue("description");
  const recommendations = product
    ? products
        .filter(
          (item) =>
            item.id !== product.id &&
            item.room === product.room &&
            (product.subcategory
              ? item.subcategory === product.subcategory
              : item.source !== "dummyjson"),
        )
        .slice(0, 4)
    : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product?.id]);

  const getProductName = (item) =>
    (lang === "en" && item.name_en) ||
    (lang === "uz" && item.name_uz) ||
    item.name;
  const specifications = [
    [t.specSize, getLocalizedValue("size")],
    [t.specColor, getLocalizedValue("color")],
    [t.specMaterial, getLocalizedValue("material") || product?.brand],
    [t.specOrigin, getLocalizedValue("origin")],
  ].filter(([, value]) => value);

  const handleReviewSubmit = (event) => {
    event.preventDefault();
    const name = reviewName.trim();
    const text = reviewText.trim();
    if (!name || !text || !product) return;

    const review = {
      id: `${Date.now()}-${Math.random()}`,
      name,
      text,
      rating: reviewRating,
      createdAt: new Date().toISOString(),
    };
    setReviewStore((current) => ({
      ...current,
      [String(product.id)]: [review, ...(current[String(product.id)] || [])],
    }));
    setReviewName("");
    setReviewText("");
    setReviewRating(5);
  };

  return (
    <div className="min-h-screen bg-[#f3f6fa] text-slate-900">
      <header className="flex min-h-16 items-center justify-between gap-4 bg-[#17375e] px-4 py-3 text-white sm:px-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 border border-white/25 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10"
        >
          <span aria-hidden="true">←</span>
          {t.storefront}
        </button>
        <button
          onClick={onBack}
          className="font-serif text-xl font-semibold text-[#a9cef5]"
        >
          ATELIER
        </button>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
        {isLoading ? (
          <p className="py-24 text-center text-slate-500">{t.loading}</p>
        ) : !product ? (
          <section className="py-24 text-center">
            <h1 className="font-serif text-3xl text-slate-900">
              {t.productNotFound}
            </h1>
            <button
              onClick={onBack}
              className="mt-6 bg-[#17375e] px-5 py-3 text-sm text-white hover:bg-[#244d78]"
            >
              {t.storefront}
            </button>
          </section>
        ) : (
          <>
            <nav
              className="mb-6 text-sm text-slate-500"
              aria-label="Breadcrumb"
            >
              <button onClick={onBack} className="hover:text-[#17375e]">
                {t.storefront}
              </button>
              <span className="mx-2">/</span>
              <span className="text-slate-800">
                {getLocalizedCategory(product.room, lang)}
              </span>
              {product.subcategory && (
                <>
                  <span className="mx-2">/</span>
                  <span>{getSubcategoryLabel(product.subcategory, lang)}</span>
                </>
              )}
            </nav>

            <div className="grid gap-8 md:grid-cols-2 md:gap-12">
              <div className="group relative aspect-4/5 overflow-hidden rounded-2xl bg-[#e9eee9] shadow-[0_24px_60px_rgba(23,55,94,0.12)]">
                <img
                  src={product.image}
                  alt={title}
                  className="h-full w-full object-contain bg-white p-3 transition-transform duration-700 group-hover:scale-[1.03]"
                  onError={(event) => {
                    event.currentTarget.src =
                      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=700";
                  }}
                />
              </div>

              <section className="flex flex-col justify-center py-2">
                <p className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e7f0e9] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#28624d]">
                  <span className="h-2 w-2 rounded-full bg-[#4a9a6c]" />
                  {getLocalizedCategory(product.room, lang)}
                </p>
                <h1 className="mt-3 font-serif text-3xl leading-tight text-slate-950 sm:text-4xl">
                  {title}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                  <span className="font-semibold text-[#a56d18]">
                    ★{" "}
                    {reviews.length
                      ? averageReviewRating.toFixed(1)
                      : product.rating || "—"}
                    <span className="ml-1 font-normal text-slate-500">
                      ({reviews.length} {t.reviewCount})
                    </span>
                  </span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span className="text-emerald-700">
                    {product.stock} {t.inStock}
                  </span>
                </div>
                <p className="mt-5 text-2xl font-semibold text-[#17375e]">
                  ${product.price}
                </p>
                {description && (
                  <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
                    {description}
                  </p>
                )}
                {specifications.length > 0 && (
                  <dl className="mt-7 divide-y divide-slate-200 border-y border-slate-200">
                    {specifications.map(([label, value]) => (
                      <div
                        key={label}
                        className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-4 py-3 text-sm"
                      >
                        <dt className="text-slate-500">{label}</dt>
                        <dd className="wrap-break-word text-right font-medium text-slate-900">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                <button
                  onClick={() => onAddToCart(product)}
                  className="mt-8 w-full rounded-xl bg-[#17375e] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#17375e]/15 transition hover:-translate-y-0.5 hover:bg-[#244d78] sm:w-auto"
                >
                  {t.addToCart} · ${product.price}
                </button>
              </section>
            </div>

            <section className="mt-16 border-t border-slate-200 pt-10">
              <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a56d18]">
                    {t.reviewHighlight}
                  </p>
                  <h2 className="mt-2 font-serif text-3xl text-slate-950 sm:text-4xl">
                    {t.reviewsTitle}
                  </h2>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-[#17375e] px-5 py-4 text-white">
                  <span className="font-serif text-3xl text-[#f4d38b]">
                    {reviews.length ? averageReviewRating.toFixed(1) : "—"}
                  </span>
                  <span>
                    <span className="block text-sm tracking-wider text-[#f4d38b]">
                      {reviews.length
                        ? "★".repeat(Math.round(averageReviewRating))
                        : "☆☆☆☆☆"}
                    </span>
                    <span className="mt-0.5 block text-xs text-white/70">
                      {reviews.length} {t.reviewCount}
                    </span>
                  </span>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
                <div className="space-y-3">
                  {reviews.length === 0 ? (
                    <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-[#cbd7d0] bg-[#f7faf7] p-6 text-center">
                      <span className="text-3xl text-[#a56d18]">✳</span>
                      <p className="mt-3 font-medium text-slate-800">
                        {t.noReviews}
                      </p>
                      <p className="mt-1 max-w-sm text-sm text-slate-500">
                        {t.reviewPrompt}
                      </p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <article
                        key={review.id}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e7f0e9] font-semibold text-[#28624d]">
                            {review.name.slice(0, 1).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h3 className="font-semibold text-slate-900">
                                {review.name}
                              </h3>
                              <time className="text-xs text-slate-400">
                                {new Intl.DateTimeFormat(lang, {
                                  dateStyle: "medium",
                                }).format(new Date(review.createdAt))}
                              </time>
                            </div>
                            <p className="mt-1 tracking-wider text-[#c28a2c]">
                              {"★".repeat(review.rating)}
                              {"☆".repeat(5 - review.rating)}
                            </p>
                            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                              {review.text}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))
                  )}
                </div>

                <form
                  onSubmit={handleReviewSubmit}
                  className="rounded-2xl bg-[#eef3ef] p-5 sm:p-6"
                >
                  <h3 className="font-serif text-2xl text-slate-950">
                    {t.writeReview}
                  </h3>
                  <label
                    className="mt-5 block text-sm font-medium text-slate-700"
                    htmlFor="review-name"
                  >
                    {t.reviewName}
                  </label>
                  <input
                    id="review-name"
                    value={reviewName}
                    onChange={(event) => setReviewName(event.target.value)}
                    placeholder={t.reviewNamePlaceholder}
                    maxLength={60}
                    required
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#4a8068] focus:ring-2 focus:ring-[#4a8068]/15"
                  />
                  <fieldset className="mt-4">
                    <legend className="text-sm font-medium text-slate-700">
                      {t.reviewRating}
                    </legend>
                    <div
                      className="mt-1 flex gap-1"
                      role="radiogroup"
                      aria-label={t.reviewRating}
                    >
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          role="radio"
                          aria-checked={reviewRating === rating}
                          aria-label={`${rating} / 5`}
                          onClick={() => setReviewRating(rating)}
                          className={`p-1 text-2xl transition hover:scale-110 ${rating <= reviewRating ? "text-[#c28a2c]" : "text-slate-300"}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <label
                    className="mt-3 block text-sm font-medium text-slate-700"
                    htmlFor="review-text"
                  >
                    {t.reviewText}
                  </label>
                  <textarea
                    id="review-text"
                    value={reviewText}
                    onChange={(event) => setReviewText(event.target.value)}
                    placeholder={t.reviewTextPlaceholder}
                    rows={4}
                    maxLength={1000}
                    required
                    className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#4a8068] focus:ring-2 focus:ring-[#4a8068]/15"
                  />
                  <button
                    type="submit"
                    className="mt-4 w-full rounded-xl bg-[#17375e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#244d78]"
                  >
                    {t.submitReview}
                  </button>
                </form>
              </div>
            </section>

            {recommendations.length > 0 && (
              <section className="mt-16 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-end">
                <aside className="flex flex-col justify-end">
                  <div className="rounded-2xl border border-[#dfe7ef] bg-[#f9fbff] p-4 shadow-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#315b87]">
                      {t.recommendations}
                    </p>
                    <div className="mt-6 flex justify-start">
                      <button
                        onClick={onBack}
                        className="rounded-full border border-[#dfe7ef] bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#17375e] transition hover:border-[#17375e] hover:bg-[#17375e] hover:text-white"
                      >
                        {t.storefront}
                      </button>
                    </div>
                  </div>
                </aside>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
                  {recommendations.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onOpenProduct(item.id)}
                      className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 text-left text-slate-900 shadow-sm transition hover:-translate-y-1 hover:border-[#a9cef5] hover:shadow-md"
                    >
                      <div className="aspect-4/5 w-full overflow-hidden bg-slate-100">
                        <img
                          src={item.image}
                          alt={getProductName(item)}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      </div>
                      <span className="w-full truncate px-3 pt-3 text-sm font-medium">
                        {getProductName(item)}
                      </span>
                      <span className="w-full px-3 pb-3 pt-1 text-sm text-slate-500">
                        ${item.price}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={onCloseToast}
        />
      )}
      <footer className="mt-12 border-t border-slate-200 bg-[#17375e] px-6 py-6 text-center text-xs text-slate-200">
        <p className="mb-1 font-serif text-base font-semibold text-[#a9cef5]">
          ATELIER BOUTIQUE
        </p>
        <p>{t.footerRights}</p>
      </footer>
    </div>
  );
}
