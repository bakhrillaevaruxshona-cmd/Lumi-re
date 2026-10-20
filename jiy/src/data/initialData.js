const CATEGORY_RULES = [
  {
    category: "Одежда",
    aliases: ["одеж", "clothing", "kiyim"],
    keywords: [
      "пальто",
      "плать",
      "рубаш",
      "куртк",
      "брюк",
      "юбк",
      "свитер",
      "coat",
      "dress",
      "shirt",
      "jacket",
      "trouser",
      "skirt",
      "sweater",
    ],
  },
  {
    category: "Аксессуары",
    aliases: ["аксессуар", "accessor", "aksessuar"],
    keywords: [
      "час",
      "кошел",
      "сумк",
      "ремень",
      "украш",
      "кольц",
      "серьг",
      "браслет",
      "watch",
      "wallet",
      "bag",
      "belt",
      "jewel",
      "jewelry",
      "jewellery",
      "necklace",
      "ring",
      "earring",
      "bracelet",
    ],
  },
  {
    category: "Декор",
    aliases: ["декор", "decor", "uy dekori"],
    keywords: ["ваза", "подсвеч", "декор", "свеч", "vase", "candel", "decor"],
  },
];

const DUMMYJSON_CATEGORIES = {
  "mens-shirts": "Одежда",
  "mens-shoes": "Одежда",
  tops: "Одежда",
  "womens-dresses": "Одежда",
  "womens-shoes": "Одежда",
  fragrances: "Аксессуары",
  "mens-watches": "Аксессуары",
  "womens-bags": "Аксессуары",
  "womens-jewellery": "Аксессуары",
  "womens-watches": "Аксессуары",
  sunglasses: "Аксессуары",
  furniture: "Декор",
  "home-decoration": "Декор",
};

const SUBCATEGORY_LABELS = {
  "mens-shirts": { ru: "Рубашки", en: "Shirts", uz: "Ko‘ylaklar" },
  "mens-shoes": {
    ru: "Мужская обувь",
    en: "Men’s shoes",
    uz: "Erkaklar oyoq kiyimi",
  },
  tops: { ru: "Одежда", en: "Clothing", uz: "Kiyimlar" },
  "womens-dresses": { ru: "Платья", en: "Dresses", uz: "Ko‘ylaklar" },
  "womens-shoes": {
    ru: "Женская обувь",
    en: "Women’s shoes",
    uz: "Ayollar oyoq kiyimi",
  },
  fragrances: { ru: "Парфюмерия", en: "Fragrances", uz: "Atirlar" },
  "mens-watches": {
    ru: "Мужские часы",
    en: "Men’s watches",
    uz: "Erkaklar soatlari",
  },
  "womens-bags": { ru: "Сумки", en: "Bags", uz: "Sumkalar" },
  "womens-jewellery": { ru: "Украшения", en: "Jewellery", uz: "Taqinchoqlar" },
  "womens-watches": {
    ru: "Женские часы",
    en: "Women’s watches",
    uz: "Ayollar soatlari",
  },
  sunglasses: { ru: "Очки", en: "Sunglasses", uz: "Ko‘zoynaklar" },
  furniture: { ru: "Мебель", en: "Furniture", uz: "Mebel" },
  "home-decoration": {
    ru: "Декор для дома",
    en: "Home decor",
    uz: "Uy bezaklari",
  },
  other: { ru: "Другое", en: "Other", uz: "Boshqa" },
};

export function mapDummyJsonProduct(product) {
  const room = DUMMYJSON_CATEGORIES[product.category];
  if (!room) return null;

  return {
    id: `api-${product.id}`,
    source: "dummyjson",
    subcategory: product.category,
    room,
    room_en:
      room === "Одежда"
        ? "Clothing"
        : room === "Аксессуары"
          ? "Accessories"
          : "Home Decor",
    room_uz:
      room === "Одежда"
        ? "Kiyimlar"
        : room === "Аксессуары"
          ? "Aksessuarlar"
          : "Uy dekori",
    name: product.title,
    description: product.description,
    price: product.price,
    image: product.thumbnail || product.images?.[0] || "",
    brand: product.brand || "",
    rating: product.rating,
    stock: product.stock,
  };
}

export function getSubcategoryLabel(category, lang = "ru") {
  return SUBCATEGORY_LABELS[category]?.[lang] || SUBCATEGORY_LABELS.other[lang];
}

export function getProductCategory(product) {
  if (
    product.room &&
    ["Одежда", "Аксессуары", "Декор"].includes(product.room)
  ) {
    return product.room;
  }

  const productText = [
    product.name,
    product.name_en,
    product.name_uz,
    product.description,
    product.description_en,
    product.description_uz,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const inferredRule = CATEGORY_RULES.find(({ keywords }) =>
    keywords.some((keyword) => productText.includes(keyword)),
  );
  if (inferredRule) return inferredRule.category;

  const categoryText = [product.room, product.room_en, product.room_uz]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const categoryRule = CATEGORY_RULES.find(({ aliases }) =>
    aliases.some((alias) => categoryText.includes(alias)),
  );
  return categoryRule ? categoryRule.category : product.room;
}

export const INITIAL_PRODUCTS = [
  {
    id: 1,
    room: "Одежда",
    room_en: "Clothing",
    room_uz: "Kiyimlar",
    name: "Кашемировое пальто",
    name_en: "Cashmere Coat",
    name_uz: "Kashmir Palto",
    price: 120,
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500",
    description:
      "Пальто высшего качества из 100% натуральной кашемировой шерсти. Теплое, легкое и приятное на ощупь.",
    description_en:
      "Premium tailored coat crafted from 100% pure cashmere wool. Warm, remarkably soft, and timeless.",
    description_uz:
      "100% tabiiy kashmir jundan tayyorlangan oliy sifatli palto. Yengil, nihoyatda issiq va qulay.",
    size: "S, M, L, XL",
    color: "Бежевый / Кэмел",
    color_en: "Beige / Camel",
    color_uz: "Bej / To‘q qum rang",
    material: "100% натуральный итальянский кашемир (плотность 480 г/м²)",
    material_en: "100% Pure Italian Cashmere (480 gsm density)",
    material_uz: "100% tabiiy italyan kashmiri (zichligi 480 g/m²)",
    origin: "Италия (Милан)",
    origin_en: "Italy (Milan)",
    origin_uz: "Italiya (Milan)",
  },
  {
    id: 2,
    room: "Одежда",
    room_en: "Clothing",
    room_uz: "Kiyimlar",
    name: "Шелковое вечернее платье",
    name_en: "Silk Evening Dress",
    name_uz: "Ipak Ko‘ylak",
    price: 85,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500",
    description:
      "Изысканное вечернее платье из нежного струящегося натурального шелка для особых моментов.",
    description_en:
      "Elegant evening gown tailored from delicate, flowing natural silk for special occasions.",
    description_uz:
      "Nafis va yumshoq tabiiy ipak matodan tikilgan unutilmas oqshom libosi.",
    size: "XS, S, M, L",
    color: "Изумрудно-зеленый",
    color_en: "Emerald Green",
    color_uz: "Zumrad yashil",
    material: "100% натуральный шелк малбери высшего класса 22 Momme",
    material_en: "100% Grade 6A Natural Mulberry Silk (22 Momme)",
    material_uz: "100% tabiiy mulberi ipak matosi (22 Momme, 6A klass)",
    origin: "Франция (Лион)",
    origin_en: "France (Lyon)",
    origin_uz: "Fransiya (Lion)",
  },
  {
    id: 3,
    room: "Аксессуары",
    room_en: "Accessories",
    room_uz: "Aksessuarlar",
    name: "Классические наручные часы",
    name_en: "Classic Wristwatch",
    name_uz: "Klassik Qo‘l Soati",
    price: 210,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500",
    description:
      "Премиальные механические часы с сапфировым стеклом, автоподзаводом и золотым напылением.",
    description_en:
      "Luxury automatic mechanical wristwatch featuring scratch-resistant sapphire crystal and 18K gold plating.",
    description_uz:
      "Mexanik harakatga ega, sapfir oynali va 18K oltin qoplamali premium qo‘l soati.",
    size: "41 мм (Диаметр корпуса)",
    size_en: "41 mm (Case Diameter)",
    size_uz: "41 mm (Korpus diametri)",
    color: "Золотистый с черным циферблатом",
    color_en: "Gold with Onyx Black dial",
    color_uz: "Oltinrang korpus, qora siferblat",
    material:
      "Хирургическая сталь 316L, 18K золото, сапфировое стекло, натуральная кожа аллигатора",
    material_en:
      "316L Surgical Grade Steel, 18K Gold PVD, Sapphire Crystal, Alligator Leather strap",
    material_uz:
      "316L zanglamas tibbiy po‘lat, 18K oltin PVD, sapfir oyna, timsoh terisidan tasma",
    origin: "Швейцария (Женева)",
    origin_en: "Switzerland (Geneva)",
    origin_uz: "Shveysariya (Jeneva)",
  },
  {
    id: 4,
    room: "Аксессуары",
    room_en: "Accessories",
    room_uz: "Aksessuarlar",
    name: "Кожаный кошелек ручной работы",
    name_en: "Handcrafted Leather Wallet",
    name_uz: "Charm Hamyon",
    price: 65,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
    description:
      "Компактный кошелек из натуральной итальянской кожи ручной выделки с защитой RFID.",
    description_en:
      "Compact bifold wallet handcrafted from full-grain vegetable-tanned leather with RFID protection.",
    description_uz:
      "Haqiqiy charmdan qo‘lda tikilgan, RFID himoyasiga ega ixcham va zamonaviy hamyon.",
    size: "11.5 x 9.5 x 1.8 см",
    size_en: "11.5 x 9.5 x 1.8 cm",
    size_uz: "11.5 x 9.5 x 1.8 sm",
    color: "Темный шоколад / Коричневый",
    color_en: "Dark Chocolate / Brown",
    color_uz: "To‘q jigarrang",
    material: "Натуральная телячья кожа растительного дубления Full-Grain",
    material_en: "Full-Grain Vegetable-Tanned Italian Calfskin",
    material_uz:
      "Italiya texnologiyasida oshlangan tabiiy sifatli buzoq terisi",
    origin: "Италия (Флоренция)",
    origin_en: "Italy (Florence)",
    origin_uz: "Italiya (Florensiya)",
  },
  {
    id: 5,
    room: "Декор",
    room_en: "Home Decor",
    room_uz: "Uy dekori",
    name: "Винтажный бронзовый подсвечник",
    name_en: "Vintage Bronze Candelabra",
    name_uz: "Bronza Shamdon",
    price: 45,
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500",
    description:
      "Элегантный декоративный элемент с филигранной художественной ковкой и благородной патиной.",
    description_en:
      "Antique decorative candelabra with artisan metal forging and noble hand-finished patina.",
    description_uz:
      "Antikvar uslubidagi nozik ishlangan, quyma metall va oliy sifatli bronza shamdon.",
    size: "34 x 22 x 14 см",
    size_en: "34 x 22 x 14 cm",
    size_uz: "34 x 22 x 14 sm",
    color: "Античная патинированная бронза",
    color_en: "Antique Patinated Bronze",
    color_uz: "Antik patinali bronza",
    material: "100% литая художественная бронза с ручной полировкой",
    material_en: "100% Solid Cast Bronze with Hand-Polished Finish",
    material_uz: "100% quyma badiiy bronza, qo‘lda silliqlangan",
    origin: "Испания (Севилья)",
    origin_en: "Spain (Seville)",
    origin_uz: "Ispaniya (Sevilya)",
  },
  {
    id: 6,
    room: "Декор",
    room_en: "Home Decor",
    room_uz: "Uy dekori",
    name: "Керамическая дизайнерская ваза",
    name_en: "Designer Ceramic Vase",
    name_uz: "Keramika Vaza",
    price: 70,
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500",
    description:
      "Минималистичная скульптурная ваза ручной лепки для современного роскошного интерьера.",
    description_en:
      "Minimalist sculpted ceramic vase hand-thrown on a wheel for contemporary modern aesthetics.",
    description_uz:
      "Minimalistik uslubdagi kulolchilik charxida qo‘l mehnati bilan yasalgan nafis keramika vaza.",
    size: "28 x 16 см (Высота x Диаметр)",
    size_en: "28 x 16 cm (Height x Diameter)",
    size_uz: "28 x 16 sm (Balandligi x Diametri)",
    color: "Айвори / Матовый теплый песок",
    color_en: "Ivory / Matte Sandstone",
    color_uz: "Ayvori / Matli sarg‘ish fil suyagi",
    material:
      "Высокотемпературный шамот, экологичная шелковисто-матовая глазурь",
    material_en: "High-fired stoneware, eco-friendly silk-matte glaze",
    material_uz:
      "Yuqori haroratda pishirilgan sopol gilosi, ekologik ipaksimon mat sir",
    origin: "Португалия (Порту)",
    origin_en: "Portugal (Porto)",
    origin_uz: "Portugaliya (Portu)",
  },
];

export const INITIAL_CATEGORIES = ["Одежда", "Аксессуары", "Декор"];

export const INITIAL_ORDERS = [
  {
    id: "ORD-101",
    customerName: "Дмитрий Иванов",
    phone: "+7 905 123-45-67",
    address: "г. Москва, ул. Тверская 12, кв. 45",
    date: "2026-09-24 14:30",
    totalPrice: 205,
    status: "Новый",
    items: [
      { id: 1, name: "Кашемировое пальто", price: 120 },
      { id: 2, name: "Шелковое вечернее платье", price: 85 },
    ],
  },
  {
    id: "ORD-102",
    customerName: "Emma Watson",
    phone: "+44 20 7946 0912",
    address: "10 Downing St, London",
    date: "2026-09-25 10:15",
    totalPrice: 210,
    status: "Доставлен",
    items: [{ id: 3, name: "Классические наручные часы", price: 210 }],
  },
];
