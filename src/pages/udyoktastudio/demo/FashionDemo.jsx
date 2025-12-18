import React, { useState, createContext, useContext } from 'react';
import { Moon, Sun, ShoppingCart, Heart, Search, Menu, X, Star, Truck, RotateCcw, Shield, Plus, Minus, ArrowLeft, ArrowRight, MessageCircle, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== CONTEXT ====================
const StoreContext = createContext();

const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};

// ==================== DATA ====================
const PRODUCTS = [
  {
    id: 1,
    name: "Premium Cotton Punjabi",
    nameBn: "প্রিমিয়াম কটন পাঞ্জাবি",
    category: "men",
    price: 1850,
    originalPrice: 2500,
    images: [
      "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=600&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80"
    ],
    rating: 4.8,
    reviews: 124,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Navy"],
    inStock: true
  },
  {
    id: 2,
    name: "Elegant Saree Collection",
    nameBn: "এলিগেন্ট শাড়ি কালেকশন",
    category: "women",
    price: 3200,
    originalPrice: 4500,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80"
    ],
    rating: 4.9,
    reviews: 89,
    sizes: ["Free Size"],
    colors: ["Red", "Blue", "Green", "Pink"],
    inStock: true
  },
  {
    id: 3,
    name: "Designer Salwar Kameez",
    nameBn: "ডিজাইনার সালোয়ার কামিজ",
    category: "women",
    price: 2400,
    originalPrice: 3200,
    images: [
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80"
    ],
    rating: 4.7,
    reviews: 156,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Maroon", "Black", "White"],
    inStock: true
  },
  {
    id: 4,
    name: "Casual T-Shirt",
    nameBn: "ক্যাজুয়াল টি-শার্ট",
    category: "men",
    price: 650,
    originalPrice: 900,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80"
    ],
    rating: 4.5,
    reviews: 234,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Gray", "Navy"],
    inStock: true
  },
  {
    id: 5,
    name: "Stylish Kurti",
    nameBn: "স্টাইলিশ কুর্তি",
    category: "women",
    price: 1200,
    originalPrice: 1800,
    images: [
      "https://images.unsplash.com/photo-1583391733981-5edd8e3a9c93?w=600&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80"
    ],
    rating: 4.6,
    reviews: 98,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Yellow", "Pink", "Blue"],
    inStock: true
  },
  {
    id: 6,
    name: "Formal Shirt",
    nameBn: "ফর্মাল শার্ট",
    category: "men",
    price: 1450,
    originalPrice: 2000,
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",
      "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=600&q=80"
    ],
    rating: 4.7,
    reviews: 167,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["White", "Blue", "Black"],
    inStock: true
  }
];

const TRANSLATIONS = {
  en: {
    shopName: "FashionBD Store",
    shopTagline: "Trendy Fashion for Modern Bangladesh",
    shopNow: "Shop Now",
    allProducts: "All Products",
    men: "Men's Fashion",
    women: "Women's Fashion",
    featured: "Featured Collection",
    addToCart: "Add to Cart",
    orderWhatsApp: "Order via WhatsApp",
    size: "Size",
    color: "Color",
    selectSize: "Select Size",
    selectColor: "Select Color",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    reviews: "reviews",
    cart: "Shopping Cart",
    emptyCart: "Your cart is empty",
    subtotal: "Subtotal",
    checkout: "Checkout via WhatsApp",
    remove: "Remove",
    qty: "Qty",
    freeDelivery: "Free Delivery",
    freeDeliveryDesc: "On orders over ৳2000",
    easyReturn: "Easy Returns",
    easyReturnDesc: "7 days return policy",
    securePayment: "Secure Payment",
    securePaymentDesc: "Cash on delivery available",
    continueShopping: "Continue Shopping",
    close: "Close"
  },
  bn: {
    shopName: "ফ্যাশনবিডি স্টোর",
    shopTagline: "আধুনিক বাংলাদেশের জন্য ট্রেন্ডি ফ্যাশন",
    shopNow: "এখনই কিনুন",
    allProducts: "সব পণ্য",
    men: "পুরুষদের ফ্যাশন",
    women: "মহিলাদের ফ্যাশন",
    featured: "ফিচার্ড কালেকশন",
    addToCart: "কার্টে যোগ করুন",
    orderWhatsApp: "WhatsApp-এ অর্ডার করুন",
    size: "সাইজ",
    color: "রঙ",
    selectSize: "সাইজ নির্বাচন করুন",
    selectColor: "রঙ নির্বাচন করুন",
    inStock: "স্টকে আছে",
    outOfStock: "স্টকে নেই",
    reviews: "রিভিউ",
    cart: "শপিং কার্ট",
    emptyCart: "আপনার কার্ট খালি",
    subtotal: "সাবটোটাল",
    checkout: "WhatsApp দিয়ে চেকআউট",
    remove: "সরান",
    qty: "পরিমাণ",
    freeDelivery: "ফ্রি ডেলিভারি",
    freeDeliveryDesc: "৳২০০০+ অর্ডারে",
    easyReturn: "সহজ রিটার্ন",
    easyReturnDesc: "৭ দিনের রিটার্ন পলিসি",
    securePayment: "নিরাপদ পেমেন্ট",
    securePaymentDesc: "ক্যাশ অন ডেলিভারি উপলব্ধ",
    continueShopping: "কেনাকাটা চালিয়ে যান",
    close: "বন্ধ করুন"
  }
};

// ==================== PROVIDER ====================
function StoreProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [lang, setLang] = useState('en');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const addToCart = (product, size, color) => {
    const existing = cart.find(
      item => item.id === product.id && item.size === size && item.color === color
    );

    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id && item.size === size && item.color === color
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1, size, color }]);
    }
  };

  const removeFromCart = (id, size, color) => {
    setCart(cart.filter(item => !(item.id === id && item.size === size && item.color === color)));
  };

  const updateQuantity = (id, size, color, delta) => {
    setCart(cart.map(item =>
      item.id === id && item.size === size && item.color === color
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    theme, setTheme,
    lang, setLang,
    cart, addToCart, removeFromCart, updateQuantity, cartTotal, cartCount,
    wishlist, toggleWishlist,
    selectedProduct, setSelectedProduct,
    cartOpen, setCartOpen,
    mobileMenuOpen, setMobileMenuOpen,
    t: TRANSLATIONS[lang]
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// ==================== COMPONENTS ====================

// Header Component
function Header() {
  const { theme, setTheme, lang, setLang, cartCount, setCartOpen, mobileMenuOpen, setMobileMenuOpen, t } = useStore();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 backdrop-blur-lg border-b ${theme === 'dark' ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-slate-200'
        }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          <DesktopNav />
          <HeaderActions />
        </div>
      </nav>
      <MobileMenu />
    </motion.header>
  );
}

function Logo() {
  const { theme, t } = useStore();

  return (
    <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
        <Package className="text-white" size={20} />
      </div>
      <div className="hidden sm:block">
        <div className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          {t.shopName}
        </div>
        <div className="text-xs text-purple-500">{t.shopTagline}</div>
      </div>
    </motion.div>
  );
}

function DesktopNav() {
  const { theme, t } = useStore();

  return (
    <div className="hidden md:flex items-center gap-6">
      <NavLink href="#products">{t.allProducts}</NavLink>
      <NavLink href="#men">{t.men}</NavLink>
      <NavLink href="#women">{t.women}</NavLink>
    </div>
  );
}

function NavLink({ href, children }) {
  const { theme } = useStore();

  return (
    <a
      href={href}
      className={`${theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}
    >
      {children}
    </a>
  );
}

function HeaderActions() {
  const { theme, setTheme, lang, setLang, cartCount, setCartOpen, mobileMenuOpen, setMobileMenuOpen } = useStore();

  return (
    <div className="flex items-center gap-3">
      <IconButton onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
      </IconButton>

      <IconButton onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}>
        <span className="text-sm font-semibold text-purple-400">
          {lang === 'en' ? 'বাং' : 'EN'}
        </span>
      </IconButton>

      <IconButton onClick={() => setCartOpen(true)} className="relative">
        <ShoppingCart size={20} />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </IconButton>

      <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  );
}

function IconButton({ children, onClick, className = '' }) {
  const { theme } = useStore();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'} ${className}`}
    >
      {children}
    </motion.button>
  );
}

function MobileMenu() {
  const { theme, mobileMenuOpen, setMobileMenuOpen, t } = useStore();

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`md:hidden border-t ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <a href="#products" onClick={() => setMobileMenuOpen(false)}>{t.allProducts}</a>
            <a href="#men" onClick={() => setMobileMenuOpen(false)}>{t.men}</a>
            <a href="#women" onClick={() => setMobileMenuOpen(false)}>{t.women}</a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hero Component
function Hero() {
  const { theme, t } = useStore();

  return (
    <section className={`min-h-[70vh] flex items-center justify-center relative overflow-hidden ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'
      }`}>
      <AnimatedBackground />
      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
            {t.shopName}
          </h1>

          <p className={`text-xl md:text-2xl mb-8 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
            {t.shopTagline}
          </p>

          <motion.a
            href="#products"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-lg shadow-2xl shadow-purple-600/50"
          >
            {t.shopNow}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-teal-600/20 via-purple-600/20 to-pink-600/20 rounded-full blur-3xl"
      />
    </div>
  );
}

// Trust Badges Component
function TrustBadges() {
  const { theme, t } = useStore();

  const badges = [
    { icon: Truck, title: t.freeDelivery, desc: t.freeDeliveryDesc },
    { icon: RotateCcw, title: t.easyReturn, desc: t.easyReturnDesc },
    { icon: Shield, title: t.securePayment, desc: t.securePaymentDesc }
  ];

  return (
    <section className={`py-12 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {badges.map((badge, i) => (
            <TrustBadge key={i} {...badge} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustBadge({ icon: Icon, title, desc, index }) {
  const { theme } = useStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`flex items-center gap-4 p-6 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'
        }`}
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          {title}
        </h3>
        <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

// Products Grid Component
function ProductsGrid() {
  const { theme, t } = useStore();

  return (
    <section id="products" className={`py-20 ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
          {t.featured}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Product Card Component
function ProductCard({ product }) {
  const { theme, wishlist, toggleWishlist, setSelectedProduct, lang, t } = useStore();
  const isWishlisted = wishlist.includes(product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className={`rounded-xl overflow-hidden border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-lg cursor-pointer`}
      onClick={() => setSelectedProduct(product)}
    >
      <ProductImage product={product} discount={discount} isWishlisted={isWishlisted} />
      <ProductInfo product={product} />
    </motion.div>
  );
}

function ProductImage({ product, discount, isWishlisted }) {
  const { toggleWishlist } = useStore();

  return (
    <div className="relative overflow-hidden aspect-square">
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
      />

      {discount > 0 && (
        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          -{discount}%
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform"
      >
        <Heart
          size={20}
          className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-700'}
        />
      </button>
    </div>
  );
}

function ProductInfo({ product }) {
  const { theme, lang, t } = useStore();

  return (
    <div className="p-4">
      <h3 className={`font-bold text-lg mb-2 line-clamp-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
        {lang === 'bn' ? product.nameBn : product.name}
      </h3>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1">
          <Star size={16} className="fill-yellow-500 text-yellow-500" />
          <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
            {product.rating}
          </span>
        </div>
        <span className={`text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
          ({product.reviews} {t.reviews})
        </span>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          ৳{product.price}
        </span>
        {product.originalPrice && (
          <span className={`text-sm line-through ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
            ৳{product.originalPrice}
          </span>
        )}
      </div>

      <div className={`text-sm font-medium ${product.inStock ? 'text-green-500' : 'text-red-500'}`}>
        {product.inStock ? t.inStock : t.outOfStock}
      </div>
    </div>
  );
}

// Product Modal Component
function ProductModal() {
  const { selectedProduct, setSelectedProduct } = useStore();

  if (!selectedProduct) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedProduct(null)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <ProductModalContent product={selectedProduct} />
      </motion.div>
    </AnimatePresence>
  );
}

function ProductModalContent({ product }) {
  const { theme, lang, t, addToCart, setSelectedProduct } = useStore();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert(lang === 'en' ? 'Please select size and color' : 'অনুগ্রহ করে সাইজ ও রঙ নির্বাচন করুন');
      return;
    }
    addToCart(product, selectedSize, selectedColor);
    alert(lang === 'en' ? 'Added to cart!' : 'কার্টে যোগ করা হয়েছে!');
  };

  const handleWhatsAppOrder = () => {
    if (!selectedSize || !selectedColor) {
      alert(lang === 'en' ? 'Please select size and color' : 'অনুগ্রহ করে সাইজ ও রঙ নির্বাচন করুন');
      return;
    }

    const message = `Hi! I want to order:
Product: ${product.name}
Size: ${selectedSize}
Color: ${selectedColor}
Price: ৳${product.price}`;

    window.open(`https://wa.me/8801792552300?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <motion.div
      initial={{ scale: 0.9, y: 50 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 50 }}
      onClick={(e) => e.stopPropagation()}
      className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'
        } shadow-2xl`}
    >
      <div className="sticky top-0 z-10 flex justify-between items-center p-4 border-b backdrop-blur-lg bg-opacity-90">
        <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          {lang === 'bn' ? product.nameBn : product.name}
        </h2>
        <button
          onClick={() => setSelectedProduct(null)}
          className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
        >
          <X size={24} />
        </button>
      </div>

      <div className="p-6 grid md:grid-cols-2 gap-8">
        <ProductImageGallery
          images={product.images}
          currentIndex={currentImageIndex}
          setCurrentIndex={setCurrentImageIndex}
        />

        <ProductDetails
          product={product}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          onAddToCart={handleAddToCart}
          onWhatsAppOrder={handleWhatsAppOrder}
        />
      </div>
    </motion.div>
  );
}

function ProductImageGallery({ images, currentIndex, setCurrentIndex }) {
  const nextImage = () => setCurrentIndex((currentIndex + 1) % images.length);
  const prevImage = () => setCurrentIndex((currentIndex - 1 + images.length) % images.length);

  return (
    <div>
      <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
        <img
          src={images[currentIndex]}
          alt="Product"
          className="w-full h-full object-cover"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform"
            >
              <ArrowRight size={20} />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${i === currentIndex ? 'border-purple-600' : 'border-transparent'
                }`}
            >
              <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductDetails({ product, selectedSize, setSelectedSize, selectedColor, setSelectedColor, onAddToCart, onWhatsAppOrder }) {
  const { theme, lang, t } = useStore();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <Star size={20} className="fill-yellow-500 text-yellow-500" />
            <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {product.rating}
            </span>
          </div>
          <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
            ({product.reviews} {t.reviews})
          </span>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <span className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            ৳{product.price}
          </span>
          {product.originalPrice && (
            <span className={`text-xl line-through ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
              ৳{product.originalPrice}
            </span>
          )}
        </div>

        <div className={`inline-block px-4 py-2 rounded-lg text-sm font-medium mb-6 ${product.inStock
            ? 'bg-green-500/20 text-green-500'
            : 'bg-red-500/20 text-red-500'
          }`}>
          {product.inStock ? t.inStock : t.outOfStock}
        </div>
      </div>

      <div>
        <label className={`block mb-3 font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          {t.size}
        </label>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map(size => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedSize === size
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : theme === 'dark'
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={`block mb-3 font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          {t.color}
        </label>
        <div className="flex flex-wrap gap-2">
          {product.colors.map(color => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedColor === color
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : theme === 'dark'
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAddToCart}
          className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg"
        >
          <ShoppingCart size={20} />
          {t.addToCart}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onWhatsAppOrder}
          className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg"
        >
          <MessageCircle size={20} />
          {t.orderWhatsApp}
        </motion.button>
      </div>
    </div>
  );
}

// Cart Sidebar Component
function CartSidebar() {
  const { cartOpen, setCartOpen } = useStore();

  if (!cartOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setCartOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      >
        <CartSidebarContent />
      </motion.div>
    </AnimatePresence>
  );
}

function CartSidebarContent() {
  const { theme, cart, cartTotal, t, setCartOpen } = useStore();

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const items = cart.map(item =>
      `${item.name} (${item.size}, ${item.color}) x${item.quantity} = ৳${item.price * item.quantity}`
    ).join('\n');

    const message = `Hi! I want to order:\n\n${items}\n\nTotal: ৳${cartTotal}`;
    window.open(`https://wa.me/8801792552300?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      onClick={(e) => e.stopPropagation()}
      className={`fixed right-0 top-0 h-full w-full max-w-md ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'
        } shadow-2xl flex flex-col`}
    >
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'} flex justify-between items-center`}>
        <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          {t.cart}
        </h2>
        <button
          onClick={() => setCartOpen(false)}
          className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {cart.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="space-y-4">
            {cart.map((item, index) => (
              <CartItem key={`${item.id}-${item.size}-${item.color}-${index}`} item={item} />
            ))}
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className={`p-4 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex justify-between items-center mb-4">
            <span className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {t.subtotal}
            </span>
            <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              ৳{cartTotal}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCheckout}
            className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg"
          >
            <MessageCircle size={20} />
            {t.checkout}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

function EmptyCart() {
  const { theme, t, setCartOpen } = useStore();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <ShoppingCart size={64} className={theme === 'dark' ? 'text-slate-700' : 'text-slate-300'} />
      <p className={`mt-4 text-lg ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
        {t.emptyCart}
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setCartOpen(false)}
        className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold"
      >
        {t.continueShopping}
      </motion.button>
    </div>
  );
}

function CartItem({ item }) {
  const { theme, lang, t, removeFromCart, updateQuantity } = useStore();

  return (
    <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
      }`}>
      <div className="flex gap-4">
        <img
          src={item.images[0]}
          alt={item.name}
          className="w-20 h-20 rounded-lg object-cover"
        />

        <div className="flex-1">
          <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {lang === 'bn' ? item.nameBn : item.name}
          </h3>
          <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {item.size} • {item.color}
          </p>
          <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            ৳{item.price * item.quantity}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateQuantity(item.id, item.size, item.color, -1)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'
              }`}
          >
            <Minus size={16} />
          </button>
          <span className={`w-8 text-center font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.size, item.color, 1)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'
              }`}
          >
            <Plus size={16} />
          </button>
        </div>

        <button
          onClick={() => removeFromCart(item.id, item.size, item.color)}
          className="text-red-500 hover:text-red-600 text-sm font-semibold"
        >
          {t.remove}
        </button>
      </div>
    </div>
  );
}

// Footer Component
function Footer() {
  const { theme, lang, t } = useStore();

  return (
    <footer className={`py-12 border-t ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Package className="text-white" size={24} />
            </div>
            <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {t.shopName}
            </span>
          </div>

          <p className={`mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.shopTagline}
          </p>

          <div className="flex justify-center gap-4 mb-6">
            <a
              href="https://wa.me/8801792552300"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
            >
              <MessageCircle size={20} />
            </a>
          </div>

          <p className={`text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
            {lang === 'en'
              ? '© 2024 FashionBD Store. Demo site by UdyoktaStudio.'
              : '© ২০২৪ ফ্যাশনবিডি স্টোর। UdyoktaStudio দ্বারা ডেমো সাইট।'}
          </p>
        </div>
      </div>
    </footer>
  );
}

// Main App Component
export default function FashionDemo() {
  return (
    <StoreProvider>
      <Main />
    </StoreProvider>
  );
}

function Main() {
  const { theme } = useStore();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <Header />
      <div className="pt-20">
        <Hero />
        <TrustBadges />
        <ProductsGrid />
      </div>
      <Footer />
      <ProductModal />
      <CartSidebar />
    </div>
  );
}