import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  getProductCategory,
  getSubcategoryLabel,
  mapDummyJsonProduct,
} from "./data/initialData";
import { translations, getLocalizedCategory } from "./i18n/translations";
import AdminLoginModal from "./components/AdminLoginModal";
import ProductFormModal from "./components/ProductFormModal";
import ProductDetailsModal from "./components/ProductDetailsModal";
import CheckoutModal from "./components/CheckoutModal";
import AdminDashboard from "./components/AdminDashboard";
import Toast from "./components/Toast";
import ProductPage from "./components/ProductPage";

export default function LuxuryShop() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const normalizeProduct = (product) => {
    const category = getProductCategory(product);

    return {
      ...product,
      room: category,
      room_en:
        category === "Одежда"
          ? "Clothing"
          : category === "Аксессуары"
            ? "Accessories"
            : category === "Декор"
              ? "Home Decor"
              : product.room_en,
      room_uz:
        category === "Одежда"
          ? "Kiyimlar"
          : category === "Аксессуары"
            ? "Aksessuarlar"
            : category === "Декор"
              ? "Uy dekori"
              : product.room_uz,
    };
  };

  // Language State: 'ru' | 'en' | 'uz'
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("atelier_lang") || "ru";
  });

  const t = translations[lang] || translations.ru;
  const profileImages = [
    "https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  ];

  const heroImages = [
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
  ];

  const [profileImageIndex, setProfileImageIndex] = useState(0);
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // State from LocalStorage or Initial Data with rich specs support
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("atelier_products");
    if (!saved) return INITIAL_PRODUCTS.map(normalizeProduct);
    try {
      const parsed = JSON.parse(saved);
      return parsed.map((item) => {
        const initial = INITIAL_PRODUCTS.find((p) => p.id === item.id);
        if (initial) {
          return normalizeProduct({
            ...initial,
            ...item,
            size: item.size || initial.size,
            color: item.color || initial.color,
            material: item.material || initial.material,
            origin: item.origin || initial.origin,
            size_en: item.size_en || initial.size_en,
            size_uz: item.size_uz || initial.size_uz,
            color_en: item.color_en || initial.color_en,
            color_uz: item.color_uz || initial.color_uz,
            material_en: item.material_en || initial.material_en,
            material_uz: item.material_uz || initial.material_uz,
            origin_en: item.origin_en || initial.origin_en,
            origin_uz: item.origin_uz || initial.origin_uz,
          });
        }
        return normalizeProduct(item);
      });
    } catch {
      return INITIAL_PRODUCTS.map(normalizeProduct);
    }
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("atelier_categories");
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("atelier_orders");
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("atelier_cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [isApiLoading, setIsApiLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(
    () => window.location.pathname.replace(/\/+$/, "") === "/admin",
  );

  // UI Modals & Interactions
  const [activeRoom, setActiveRoom] = useState("ALL");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(
    () => window.location.pathname.replace(/\/+$/, "") === "/admin",
  );
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProductForDetails, setSelectedProductForDetails] =
    useState(null);
  const [toast, setToast] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState("ALL");
  const [currentView, setCurrentView] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("atelier_profile");
    if (!saved) {
      return {
        name: "Ruxshona",
        phone: "+998 90 123 45 67",
        bio: "Zamonoviy uslub va nafis tanlovni sevuvchi xaridorga xizmat qilaman.",
      };
    }

    try {
      return {
        ...{
          name: "Ruxshona",
          phone: "+998 90 123 45 67",
          bio: "Zamonoviy uslub va nafis tanlovni sevuvchi xaridorga xizmat qilaman.",
        },
        ...JSON.parse(saved),
      };
    } catch {
      return {
        name: "Ruxshona",
        phone: "+998 90 123 45 67",
        bio: "Zamonoviy uslub va nafis tanlovni sevuvchi xaridorga xizmat qilaman.",
      };
    }
  });
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("atelier_intro_seen");
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem("atelier_lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("atelier_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (!showIntro) return;

    const timer = setTimeout(() => {
      localStorage.setItem("atelier_intro_seen", "true");
      setShowIntro(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, [showIntro]);

  useEffect(() => {
    localStorage.removeItem("atelier_isAdmin");
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const isAdminPath =
        window.location.pathname.replace(/\/+$/, "") === "/admin";
      setIsAdminRoute(isAdminPath);
      setIsAdminLoginOpen(isAdminPath);
      setIsAdmin(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    localStorage.setItem("atelier_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    let isCurrent = true;

    fetch("https://dummyjson.com/products?limit=0")
      .then((response) => {
        if (!response.ok) throw new Error("Product request failed");
        return response.json();
      })
      .then((data) => {
        if (!isCurrent || !Array.isArray(data.products)) return;
        const apiProducts = data.products
          .map(mapDummyJsonProduct)
          .filter(Boolean)
          .map(normalizeProduct);

        setProducts((currentProducts) => {
          const existingIds = new Set(
            currentProducts.map((product) => product.id),
          );
          const newProducts = apiProducts.filter(
            (product) => !existingIds.has(product.id),
          );
          return [...newProducts, ...currentProducts];
        });
      })
      .catch(() => {})
      .finally(() => {
        if (isCurrent) setIsApiLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("atelier_categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("atelier_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("atelier_cart", JSON.stringify(cart));
  }, [cart]);

  // Toast Helper
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Helper for localized product fields
  const getProductName = (p) => {
    if (lang === "en" && p.name_en) return p.name_en;
    if (lang === "uz" && p.name_uz) return p.name_uz;
    return p.name;
  };

  const getProductDesc = (p) => {
    if (lang === "en" && p.description_en) return p.description_en;
    if (lang === "uz" && p.description_uz) return p.description_uz;
    return p.description;
  };

  const getProductRoom = (p) => {
    if (lang === "en" && p.room_en) return p.room_en;
    if (lang === "uz" && p.room_uz) return p.room_uz;
    return p.room;
  };

  // Cart Handlers
  const addToCart = (product) => {
    const localizedName = getProductName(product);
    setCart((prev) => [
      ...prev,
      {
        ...product,
        name: localizedName,
        cartId: Date.now() + Math.random(),
      },
    ]);
    showToast(`"${localizedName}" ${t.addedToCart}`);
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
    showToast(t.removedFromCart, "info");
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const toggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const favoriteProducts = products.filter((product) =>
    favorites.includes(product.id),
  );

  const searchMatches = (product) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      getProductName(product).toLowerCase().includes(q) ||
      getProductDesc(product)?.toLowerCase().includes(q) ||
      getProductRoom(product).toLowerCase().includes(q)
    );
  };

  // Checkout Handler
  const handleConfirmOrder = (orderData) => {
    setOrders((prev) => [orderData, ...prev]);
    setCart([]);
    setIsCartOpen(false);
    showToast(t.orderPlacedSuccess.replace("{id}", orderData.id));
  };

  // Admin Auth Handlers
  const handleAdminLogin = () => {
    setIsAdmin(true);
    setIsAdminLoginOpen(false);
    showToast(t.loginSuccess);
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setIsAdminRoute(false);
    setIsAdminLoginOpen(false);
    navigate("/");
    showToast(t.logoutSuccess, "info");
  };

  const handleReturnToShop = () => {
    setIsAdmin(false);
    setIsAdminRoute(false);
    setIsAdminLoginOpen(false);
    navigate("/");
  };

  // Product CRUD Handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (productData, newCategory) => {
    const normalizedProduct = normalizeProduct(productData);

    if (newCategory && !categories.includes(newCategory)) {
      setCategories((prev) => [...prev, newCategory]);
    }

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((item) =>
          item.id === normalizedProduct.id ? normalizedProduct : item,
        ),
      );
      showToast(
        t.productUpdatedSuccess.replace("{name}", normalizedProduct.name),
      );
    } else {
      setProducts((prev) => [normalizedProduct, ...prev]);
      showToast(
        t.productAddedSuccess.replace("{name}", normalizedProduct.name),
      );
    }
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm(t.confirmDeleteProduct)) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      showToast(t.productDeletedSuccess, "info");
    }
  };

  // Orders Status & Management Handlers
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
    );
    showToast(
      t.statusUpdatedSuccess
        .replace("{id}", orderId)
        .replace("{status}", newStatus),
    );
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm(t.confirmDeleteOrder)) {
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      showToast(t.orderDeletedSuccess, "info");
    }
  };

  // Category Handlers
  const handleAddCategory = (catName) => {
    if (categories.includes(catName)) {
      showToast(t.categoryAlreadyExists, "error");
      return;
    }
    setCategories((prev) => [...prev, catName]);
    showToast(t.categoryAddedSuccess.replace("{name}", catName));
  };

  const handleDeleteCategory = (catName) => {
    if (window.confirm(t.confirmDeleteCategory.replace("{name}", catName))) {
      setCategories((prev) => prev.filter((c) => c !== catName));
      if (activeRoom === catName) setActiveRoom("ALL");
      showToast(t.categoryDeletedSuccess.replace("{name}", catName));
    }
  };

  // Render Admin Dashboard if in Admin view
  if (isAdmin && isAdminRoute) {
    return (
      <>
        <AdminDashboard
          products={products}
          categories={categories}
          orders={orders}
          onAddProduct={handleOpenAddProduct}
          onEditProduct={handleOpenEditProduct}
          onDeleteProduct={handleDeleteProduct}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onDeleteOrder={handleDeleteOrder}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          onSwitchToShop={handleReturnToShop}
          onLogout={handleAdminLogout}
          lang={lang}
          onChangeLang={setLang}
          onViewProduct={setSelectedProductForDetails}
        />

        <ProductFormModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          onSave={handleSaveProduct}
          editingProduct={editingProduct}
          categories={categories}
          lang={lang}
        />

        <ProductDetailsModal
          isOpen={!!selectedProductForDetails}
          product={selectedProductForDetails}
          onClose={() => setSelectedProductForDetails(null)}
          onAddToCart={addToCart}
          lang={lang}
        />

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </>
    );
  }

  if (productId) {
    const product = products.find((item) => String(item.id) === productId);

    return (
      <ProductPage
        product={product}
        products={products}
        lang={lang}
        isLoading={isApiLoading}
        onBack={() => navigate("/")}
        onOpenProduct={(id) => navigate(`/products/${encodeURIComponent(id)}`)}
        onAddToCart={addToCart}
        toast={toast}
        onCloseToast={() => setToast(null)}
      />
    );
  }

  // Filter products for Shop view
  const displayedProducts =
    activeRoom === "ALL"
      ? products
      : products.filter((item) => {
          const room = getProductRoom(item);
          return room === activeRoom || item.room === activeRoom;
        });
  const availableSubcategories = [
    ...new Set(
      displayedProducts
        .filter((product) => product.subcategory)
        .map((product) => product.subcategory),
    ),
  ];
  const filteredProducts =
    activeSubcategory === "ALL"
      ? displayedProducts
      : displayedProducts.filter(
          (product) => product.subcategory === activeSubcategory,
        );

  return (
    <div className="home-scroll-container h-screen overflow-x-hidden overflow-y-auto bg-[#edf2ee] p-4 text-[#1e1e1e]">
      {showIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d0d12]/70 backdrop-blur-sm">
          <div className="w-[min(340px,calc(100vw-32px))] rounded-[28px] border border-[#d4af37]/40 bg-[#fffaf6] p-6 text-center shadow-[0_20px_60px_rgba(15,10,12,0.35)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#d4af37] bg-[#58111A] text-2xl font-bold text-[#f6e7b0]">
              A
            </div>
            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#7a4c32]">
              Welcome
            </p>
            <h3 className="mt-2 font-serif text-3xl text-[#58111A]">ATELIER</h3>
            <p className="mt-2 text-sm text-stone-600">
              Luxury essentials for refined living.
            </p>
            <button
              onClick={() => {
                localStorage.setItem("atelier_intro_seen", "true");
                setShowIntro(false);
              }}
              className="mt-5 rounded-full bg-[#58111A] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#f6e7b0] transition hover:bg-[#721C24]"
            >
              Enter
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1600px]">
        <div className="flex-1 space-y-5">
          <header className="flex flex-wrap items-center gap-3 rounded-[26px] bg-[#f8f8f4] px-5 py-4 shadow-[0_8px_25px_rgba(24,27,25,0.05)]">
            <div className="shrink-0 font-serif text-2xl tracking-tight text-[#0d352f]">
              Lumière
            </div>
            <nav className="order-3 flex w-full flex-wrap items-center gap-1 md:order-none md:w-auto md:flex-1">
              {[
                { key: "home", label: "Bosh sahifa", icon: "⌂" },
                { key: "products", label: "Mahsulotlar", icon: "▣" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setCurrentView(item.key)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-left text-xs transition sm:text-sm ${
                    currentView === item.key ||
                    (item.key === "home" && currentView === "home")
                      ? "bg-[#1c4c43] text-white shadow-inner"
                      : "text-[#54605d] hover:bg-[#edf2ee]"
                  }`}
                >
                  <span className="flex h-6 w-6 items-center justify-center text-base">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge ? (
                    <span className="rounded-full bg-[#d4af37] px-2 py-0.5 text-[10px] font-bold text-[#0d352f]">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              ))}
            </nav>

            <div className="flex min-w-[180px] flex-1 items-center gap-3 rounded-full bg-[#edf2ee] px-4 py-3 text-sm text-[#54605d] sm:min-w-[220px]">
              <span>⌕</span>
              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentView("products");
                }}
                placeholder="Qidiruv..."
                className="w-full border-0 bg-transparent text-sm text-[#54605d] outline-none placeholder:text-[#54605d]"
              />
            </div>

            <button
              onClick={() => setCurrentView("favorites")}
              aria-label="Sevimlilar"
              className="text-xl text-[#1d2b29]"
            >
              ♡
            </button>
            <button
              onClick={() => setCurrentView("cart")}
              aria-label="Savatcha"
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#f0eee9] text-[#1d2b29]"
            >
              <span>◔</span>
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d4af37] px-1 text-[10px] font-bold text-[#0d352f]">
                {cart.length}
              </span>
            </button>
            <button
              onClick={() => setCurrentView("profile")}
              className="flex items-center gap-2 rounded-full bg-[#f0eee9] px-2 py-1.5"
            >
              <div
                className="h-8 w-8 rounded-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('${profileImages[profileImageIndex]}')`,
                }}
              />
              <div className="text-left text-xs text-[#1d2b29]">
                <div className="font-semibold">{profile.name}</div>
              </div>
              <span className="text-xs">˅</span>
            </button>
          </header>

          {currentView === "profile" ? (
            <section className="rounded-[28px] bg-[#f8f8f4] p-6 shadow-[0_8px_25px_rgba(24,27,25,0.04)]">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="h-20 w-20 rounded-full bg-cover bg-center ring-4 ring-[#d4af37]/25"
                    style={{
                      backgroundImage: `url('${profileImages[profileImageIndex]}')`,
                    }}
                  />
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#5b6d68]">
                      Profile
                    </p>
                    <h3 className="mt-1 font-serif text-3xl text-[#1d2b29]">
                      {profile.name}
                    </h3>
                    <p className="text-sm text-[#54605d]">{profile.phone}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsAdminLoginOpen(true)}
                  className="rounded-full bg-[#0d352f] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f6e7b0]"
                >
                  Admin login
                </button>
              </div>

              <div className="mt-6 rounded-[24px] border border-[#e8e2d9] bg-white p-5 shadow-sm">
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#687874]">
                  Contact info
                </div>
                <div className="mt-4 space-y-3 text-sm text-[#1d2b29]">
                  <div className="flex items-center justify-between gap-3 border-b border-[#f0ece5] pb-2">
                    <label className="text-[#54605d]">Ism</label>
                    <input
                      value={profile.name}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="max-w-[60%] border-0 bg-transparent text-right font-semibold text-[#1d2b29] outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 border-b border-[#f0ece5] pb-2">
                    <label className="text-[#54605d]">Telefon</label>
                    <input
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="max-w-[60%] border-0 bg-transparent text-right font-semibold text-[#1d2b29] outline-none"
                    />
                  </div>
                  <div className="flex items-start justify-between gap-3 pt-1">
                    <label className="text-[#54605d]">Ozi</label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile((prev) => ({ ...prev, bio: e.target.value }))
                      }
                      rows={3}
                      className="max-w-[60%] resize-none border-0 bg-transparent text-right font-medium text-[#1d2b29] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  { label: "Buyurtmalar", value: orders.length },
                  { label: "Sevimlilar", value: favorites.length },
                  { label: "Savat", value: cart.length },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-[#e8e2d9] bg-white p-4"
                  >
                    <div className="text-xs uppercase tracking-[0.18em] text-[#687874]">
                      {stat.label}
                    </div>
                    <div className="mt-2 text-2xl font-bold text-[#1d2b29]">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : currentView === "favorites" ? (
            <section className="rounded-[28px] bg-[#f8f8f4] p-4 shadow-[0_8px_25px_rgba(24,27,25,0.04)]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-serif text-2xl text-[#1d2b29]">
                  Sevimlilar
                </h3>
                <button
                  onClick={() => setCurrentView("home")}
                  className="rounded-full border border-[#dfeae5] bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1d2b29]"
                >
                  Orqaga
                </button>
              </div>

              {favoriteProducts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#d7d7d1] bg-[#f3f5f2] p-8 text-center text-sm text-[#6b736f]">
                  Hozircha sevimli mahsulotlar yo'q.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {favoriteProducts.map((product) => (
                    <div
                      key={product.id}
                      className="overflow-hidden rounded-[22px] border border-[#e8e2d9] bg-white p-0 shadow-sm"
                    >
                      <img
                        src={product.image}
                        alt={getProductName(product)}
                        className="h-52 w-full object-contain bg-[#f4f1ee] p-3"
                      />
                      <div className="p-3">
                        <h4 className="text-base font-semibold text-[#1d2b29]">
                          {getProductName(product)}
                        </h4>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-lg font-bold text-[#1d2b29]">
                            {product.price} so'm
                          </span>
                          <button
                            onClick={() =>
                              navigate(
                                `/products/${encodeURIComponent(product.id)}`,
                              )
                            }
                            className="rounded-full bg-[#0d352f] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f6e7b0]"
                          >
                            {t.viewDetails}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ) : currentView === "cart" ? (
            <section className="rounded-[28px] bg-[#f8f8f4] p-6 shadow-[0_8px_25px_rgba(24,27,25,0.04)]">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#687874]">
                    Savat
                  </p>
                  <h3 className="mt-2 font-serif text-4xl text-[#1d2b29]">
                    Buyurtma savati
                  </h3>
                </div>
                <button
                  onClick={() => setCurrentView("home")}
                  className="rounded-full border border-[#dfeae5] bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1d2b29]"
                >
                  Orqaga
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-[#d7d7d1] bg-[#f3f5f2] p-10 text-center">
                  <div className="text-4xl">🛒</div>
                  <p className="mt-4 text-lg font-medium text-[#1d2b29]">
                    Savatingiz hozircha bo'sh
                  </p>
                  <button
                    onClick={() => setCurrentView("products")}
                    className="mt-5 rounded-full bg-[#0d352f] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f6e7b0]"
                  >
                    Mahsulotlarni ko'rish
                  </button>
                </div>
              ) : (
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.cartId}
                        className="flex items-center gap-4 rounded-[22px] border border-[#e8e2d9] bg-white p-3 shadow-sm"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-24 w-24 rounded-2xl object-cover bg-[#f4f1ee]"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm text-[#54605d]">
                            {item.room || "Mahsulot"}
                          </div>
                          <h4 className="mt-1 text-lg font-semibold text-[#1d2b29]">
                            {item.name}
                          </h4>
                          <div className="mt-2 text-[#0d352f] font-bold">
                            {item.price} so'm
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.cartId)}
                          className="rounded-full border border-[#e7d4d4] bg-[#fff4f4] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8d3d3d]"
                        >
                          O'chirish
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="min-w-0 rounded-[24px] border border-[#e8e2d9] bg-white p-5 shadow-sm">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#687874]">
                      Jami
                    </div>
                    <div className="mt-4 max-w-full overflow-hidden break-words text-3xl font-bold leading-tight text-[#1d2b29] sm:text-4xl">
                      {totalPrice} so'm
                    </div>
                    <div className="mt-5 space-y-2 text-sm text-[#54605d]">
                      <div className="flex items-center justify-between">
                        <span>Mahsulotlar</span>
                        <span>{cart.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Yetkazib berish</span>
                        <span>0 so'm</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsCheckoutOpen(true)}
                      disabled={cart.length === 0}
                      className="mt-6 w-full rounded-full bg-[#0d352f] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f1e7ba] disabled:opacity-40 disabled:pointer-events-none"
                    >
                      Buyurtma berish →
                    </button>
                  </div>
                </div>
              )}
            </section>
          ) : currentView === "products" ? (
            <section className="space-y-5">
              <div className="rounded-[28px] bg-[#f8f8f4] p-4 shadow-[0_8px_25px_rgba(24,27,25,0.04)]">
                <div className="mb-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveRoom("ALL")}
                    className={`rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                      activeRoom === "ALL"
                        ? "border-[#0d352f] bg-[#0d352f] text-[#f6e7b0]"
                        : "border-[#dfeae5] bg-white text-[#1d2b29]"
                    }`}
                  >
                    Barchasi
                  </button>
                  {categories.map((room) => (
                    <button
                      key={room}
                      onClick={() => setActiveRoom(room)}
                      className={`rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                        activeRoom === room
                          ? "border-[#0d352f] bg-[#0d352f] text-[#f6e7b0]"
                          : "border-[#dfeae5] bg-white text-[#1d2b29]"
                      }`}
                    >
                      {getLocalizedCategory(room, lang)}
                    </button>
                  ))}
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {filteredProducts.filter(searchMatches).map((product) => (
                    <div
                      key={product.id}
                      onClick={() =>
                        navigate(`/products/${encodeURIComponent(product.id)}`)
                      }
                      className="group cursor-pointer overflow-hidden rounded-[22px] border border-[#e8e2d9] bg-white p-0 shadow-[0_10px_20px_rgba(24,27,25,0.03)] transition hover:-translate-y-1"
                    >
                      <div className="relative h-52 bg-[#f4f1ee]">
                        <button
                          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[#1d2b29] shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(product.id);
                          }}
                        >
                          {favorites.includes(product.id) ? "♥" : "♡"}
                        </button>
                        <img
                          src={product.image}
                          alt={getProductName(product)}
                          className="h-full w-full object-contain p-3"
                        />
                      </div>
                      <div className="p-3">
                        <div className="text-[12px] text-[#54605d]">
                          {getLocalizedCategory(getProductRoom(product), lang)}
                        </div>
                        <h4 className="mt-1 text-base font-semibold text-[#1d2b29]">
                          {getProductName(product)}
                        </h4>
                        <div className="mt-2 flex items-end justify-between">
                          <div className="text-lg font-bold text-[#1d2b29]">
                            {product.price} so'm
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(
                                `/products/${encodeURIComponent(product.id)}`,
                              );
                            }}
                            className="rounded-full bg-[#0d352f] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f6e7b0]"
                          >
                            {t.viewDetails}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : (
            <main className="space-y-5">
              <section
                className="relative overflow-hidden rounded-[30px] bg-[#0d352f] p-7 text-white shadow-[0_18px_40px_rgba(13,53,47,0.18)]"
                style={{
                  backgroundImage: `linear-gradient(90deg, rgba(5,20,19,0.78) 0%, rgba(5,20,19,0.35) 42%, rgba(5,20,19,0.12) 100%), url('${heroImages[heroImageIndex]}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="max-w-[420px]">
                  <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#f2d98b]">
                    Yangi ko'rinish
                  </p>
                  <h2 className="mt-4 font-serif text-[clamp(2.5rem,4vw,4rem)] leading-[0.95] text-[#f9f6f0]">
                    Siz uchun eng sara <br /> kiyim-kechaklar
                  </h2>
                  <p className="mt-4 max-w-sm text-sm text-[#e7e1db]">
                    Zamonoviy uslub, sifatli material va har bir ayol uchun
                    o'ziga xos tarz.
                  </p>
                  <button
                    onClick={() => setCurrentView("products")}
                    className="mt-6 rounded-xl border border-[#f0e3c7] bg-[#f0e3c7] px-5 py-3 text-sm font-semibold text-[#102b29]"
                  >
                    Xarid qilish →
                  </button>
                </div>

                <div className="mt-8 flex items-center gap-3 text-xs text-[#e7e1db]">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-white/80" />
                  <span className="opacity-60">01</span>
                  <span className="mx-2 h-px w-8 bg-white/30" />
                  <span className="opacity-60">02</span>
                  <span className="mx-2 h-px w-8 bg-white/30" />
                  <span className="opacity-60">03</span>
                </div>
              </section>

              <section className="rounded-[28px] bg-[#f8f8f4] p-4 shadow-[0_8px_25px_rgba(24,27,25,0.04)]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-serif text-2xl text-[#1d2b29]">
                    Mashhur mahsulotlar
                  </h3>
                  <button
                    onClick={() => setCurrentView("products")}
                    className="rounded-full border border-[#dfeae5] bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1d2b29]"
                  >
                    Barchasi →
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {filteredProducts
                    .filter(searchMatches)
                    .slice(0, 4)
                    .map((product) => (
                      <div
                        key={product.id}
                        onClick={() =>
                          navigate(
                            `/products/${encodeURIComponent(product.id)}`,
                          )
                        }
                        className="group cursor-pointer overflow-hidden rounded-[22px] border border-[#e8e2d9] bg-white p-0 shadow-[0_10px_20px_rgba(24,27,25,0.03)] transition hover:-translate-y-1"
                      >
                        <div className="relative h-52 bg-[#f4f1ee]">
                          <button
                            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[#1d2b29] shadow-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(product.id);
                            }}
                          >
                            {favorites.includes(product.id) ? "♥" : "♡"}
                          </button>
                          <img
                            src={product.image}
                            alt={getProductName(product)}
                            className="h-full w-full object-contain p-3"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600";
                            }}
                          />
                        </div>

                        <div className="p-3">
                          <div className="text-[12px] text-[#54605d]">
                            {getLocalizedCategory(
                              getProductRoom(product),
                              lang,
                            )}
                          </div>
                          <h4 className="mt-1 text-base font-semibold text-[#1d2b29]">
                            {getProductName(product)}
                          </h4>
                          <div className="mt-2 flex items-end justify-between">
                            <div className="text-lg font-bold text-[#1d2b29]">
                              {product.price} so'm
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/products/${encodeURIComponent(product.id)}`,
                                );
                              }}
                              className="rounded-full bg-[#0d352f] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f6e7b0]"
                            >
                              {t.viewDetails}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            </main>
          )}
        </div>
      </div>

      {/* Admin Login Modal */}

      {/* Savatcha Modal / Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 flex justify-end">
          <div className="bg-[#FFFFF0] w-full max-w-md h-full shadow-2xl flex flex-col border-l border-[#D4AF37] animate-in slide-in-from-right duration-200">
            <div className="p-4 bg-[#58111A] text-[#FFFFF0] flex justify-between items-center border-b border-[#D4AF37]">
              <div className="flex items-center gap-2">
                <span className="text-lg">🛍️</span>
                <h3 className="font-serif text-lg text-[#D4AF37] font-semibold">
                  {t.cartTitle} ({cart.length})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-[#FFFFF0] hover:text-[#D4AF37] text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 divide-y divide-[#E5E0D8]">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-stone-500">
                  <span className="text-4xl block mb-2">🛒</span>
                  <p className="font-serif text-base">{t.cartEmptyTitle}</p>
                  <p className="text-xs text-stone-400 mt-1">
                    {t.cartEmptySub}
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.cartId}
                    className="py-3 flex justify-between items-center gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover border border-[#E5E0D8] rounded"
                      />
                      <div>
                        <h4 className="font-medium text-[#58111A] text-sm">
                          {item.name}
                        </h4>
                        <p className="text-xs text-[#D4AF37] font-bold">
                          ${item.price}
                        </p>
                      </div>
                    </div>
                    {/* O‘chirish tugmasi */}
                    <button
                      onClick={() => removeFromCart(item.cartId)}
                      className="px-2.5 py-1 bg-red-50 text-red-700 hover:bg-red-100 text-xs rounded transition font-medium"
                    >
                      {t.remove}
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-[#FDFBF7] border-t border-[#E5E0D8]">
              <div className="flex justify-between items-center mb-4 font-serif text-lg">
                <span className="text-[#58111A] font-semibold">
                  {t.cartTotal}
                </span>
                <span className="text-[#D4AF37] font-bold text-xl">
                  ${totalPrice}
                </span>
              </div>
              <button
                disabled={cart.length === 0}
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-3 bg-[#58111A] text-[#D4AF37] border border-[#D4AF37] hover:bg-[#721C24] hover:text-white transition disabled:opacity-40 disabled:pointer-events-none font-bold tracking-wide uppercase text-xs sm:text-sm shadow"
              >
                {t.checkoutBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminRoute && isAdminLoginOpen}
        onClose={handleReturnToShop}
        onLogin={handleAdminLogin}
        lang={lang}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        totalPrice={totalPrice}
        onConfirmOrder={handleConfirmOrder}
        lang={lang}
      />

      {/* Product Form Modal (for adding/editing) */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
        categories={categories}
        lang={lang}
      />

      {/* Product Details Modal (Size, Color, Material, Origin) */}
      <ProductDetailsModal
        isOpen={!!selectedProductForDetails}
        product={selectedProductForDetails}
        onClose={() => setSelectedProductForDetails(null)}
        onAddToCart={addToCart}
        lang={lang}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-[#0d352f] text-[#FFFFF0] border-t-2 border-[#D4AF37] py-6 px-6 mt-12 text-center text-xs">
        <p className="font-serif tracking-widest text-[#D4AF37] text-base mb-1">
          ATELIER BOUTIQUE
        </p>
        <p className="text-stone-300">{t.footerRights}</p>
      </footer>
    </div>
  );
}
