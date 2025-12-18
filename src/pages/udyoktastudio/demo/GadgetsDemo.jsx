import React, { useState, createContext, useContext } from 'react';
import { Moon, Sun, ShoppingCart, Heart, Menu, X, Star, Truck, RotateCcw, Shield, Plus, Minus, MessageCircle, Zap } from 'lucide-react';
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
        name: "Wireless Earbuds Pro",
        nameBn: "ওয়্যারলেস ইয়ারবাডস প্রো",
        category: "audio",
        price: 2850,
        originalPrice: 4500,
        images: [
            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80",
            "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=600&q=80"
        ],
        rating: 4.8,
        reviews: 342,
        specs: ["Bluetooth 5.3", "30hr Battery", "ANC"],
        colors: ["Black", "White", "Blue"],
        inStock: true,
        featured: true
    },
    {
        id: 2,
        name: "Smart Watch Ultra",
        nameBn: "স্মার্ট ওয়াচ আল্ট্রা",
        category: "wearable",
        price: 4500,
        originalPrice: 6800,
        images: [
            "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80",
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"
        ],
        rating: 4.9,
        reviews: 567,
        specs: ["AMOLED Display", "7 Days Battery", "Health Tracking"],
        colors: ["Black", "Silver", "Gold"],
        inStock: true,
        featured: true
    },
    {
        id: 3,
        name: "Power Bank 20000mAh",
        nameBn: "পাওয়ার ব্যাংক ২০০০০এমএএইচ",
        category: "accessories",
        price: 1650,
        originalPrice: 2400,
        images: [
            "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80",
            "https://images.unsplash.com/photo-1622479515807-e6e3c2e38815?w=600&q=80"
        ],
        rating: 4.7,
        reviews: 234,
        specs: ["20000mAh", "Fast Charge", "Dual USB"],
        colors: ["Black", "White"],
        inStock: true,
        featured: true
    },
    {
        id: 4,
        name: "Bluetooth Speaker",
        nameBn: "ব্লুটুথ স্পিকার",
        category: "audio",
        price: 3200,
        originalPrice: 4800,
        images: [
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
            "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80"
        ],
        rating: 4.6,
        reviews: 189,
        specs: ["360° Sound", "Waterproof", "24hr Battery"],
        colors: ["Black", "Red", "Blue"],
        inStock: true,
        featured: false
    },
    {
        id: 5,
        name: "USB Type-C Hub",
        nameBn: "ইউএসবি টাইপ-সি হাব",
        category: "accessories",
        price: 1850,
        originalPrice: 2800,
        images: [
            "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600&q=80",
            "https://images.unsplash.com/photo-1591290619762-c588e5c3e00a?w=600&q=80"
        ],
        rating: 4.5,
        reviews: 156,
        specs: ["7-in-1", "4K HDMI", "100W PD"],
        colors: ["Gray", "Silver"],
        inStock: true,
        featured: true
    },
    {
        id: 6,
        name: "Gaming Mouse RGB",
        nameBn: "গেমিং মাউস আরজিবি",
        category: "gaming",
        price: 1450,
        originalPrice: 2200,
        images: [
            "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80",
            "https://images.unsplash.com/photo-1625275435780-2abfbcdeb7ec?w=600&q=80"
        ],
        rating: 4.8,
        reviews: 423,
        specs: ["16000 DPI", "RGB Lighting", "Programmable"],
        colors: ["Black", "White"],
        inStock: true,
        featured: false
    }
];

const TRANSLATIONS = {
    en: {
        shopName: "TechBD Gadgets",
        shopTagline: "Latest Tech & Gadgets for Smart Bangladesh",
        shopNow: "Shop Now",
        allProducts: "All Products",
        audio: "Audio",
        wearable: "Wearables",
        accessories: "Accessories",
        gaming: "Gaming",
        featured: "Featured Gadgets",
        addToCart: "Add to Cart",
        orderWhatsApp: "Order via WhatsApp",
        color: "Color",
        selectColor: "Select Color",
        inStock: "In Stock",
        outOfStock: "Out of Stock",
        reviews: "reviews",
        cart: "Shopping Cart",
        emptyCart: "Your cart is empty",
        subtotal: "Subtotal",
        checkout: "Checkout via WhatsApp",
        remove: "Remove",
        specifications: "Specifications",
        freeDelivery: "Free Delivery",
        freeDeliveryDesc: "On orders over ৳2000",
        easyReturn: "Easy Returns",
        easyReturnDesc: "7 days return policy",
        securePayment: "Warranty",
        securePaymentDesc: "1 year official warranty",
        continueShopping: "Continue Shopping",
        close: "Close"
    },
    bn: {
        shopName: "টেকবিডি গ্যাজেটস",
        shopTagline: "স্মার্ট বাংলাদেশের জন্য লেটেস্ট টেক ও গ্যাজেট",
        shopNow: "এখনই কিনুন",
        allProducts: "সব পণ্য",
        audio: "অডিও",
        wearable: "ওয়্যারেবল",
        accessories: "এক্সেসরিজ",
        gaming: "গেমিং",
        featured: "ফিচার্ড গ্যাজেটস",
        addToCart: "কার্টে যোগ করুন",
        orderWhatsApp: "WhatsApp-এ অর্ডার করুন",
        color: "রঙ",
        selectColor: "রঙ নির্বাচন করুন",
        inStock: "স্টকে আছে",
        outOfStock: "স্টকে নেই",
        reviews: "রিভিউ",
        cart: "শপিং কার্ট",
        emptyCart: "আপনার কার্ট খালি",
        subtotal: "সাবটোটাল",
        checkout: "WhatsApp দিয়ে চেকআউট",
        remove: "সরান",
        specifications: "স্পেসিফিকেশন",
        freeDelivery: "ফ্রি ডেলিভারি",
        freeDeliveryDesc: "৳২০০০+ অর্ডারে",
        easyReturn: "সহজ রিটার্ন",
        easyReturnDesc: "৭ দিনের রিটার্ন পলিসি",
        securePayment: "ওয়্যারেন্টি",
        securePaymentDesc: "১ বছরের অফিশিয়াল ওয়্যারেন্টি",
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

    const addToCart = (product, color) => {
        const existing = cart.find(
            item => item.id === product.id && item.color === color
        );

        if (existing) {
            setCart(cart.map(item =>
                item.id === product.id && item.color === color
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1, color }]);
        }
    };

    const removeFromCart = (id, color) => {
        setCart(cart.filter(item => !(item.id === id && item.color === color)));
    };

    const updateQuantity = (id, color, delta) => {
        setCart(cart.map(item =>
            item.id === id && item.color === color
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
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                <Zap className="text-white" size={20} />
            </div>
            <div className="hidden sm:block">
                <div className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {t.shopName}
                </div>
                <div className="text-xs text-blue-500">{t.shopTagline}</div>
            </div>
        </motion.div>
    );
}

function DesktopNav() {
    const { theme, t } = useStore();

    const links = [
        { href: "#products", label: t.allProducts },
        { href: "#audio", label: t.audio },
        { href: "#wearable", label: t.wearable },
    ];

    return (
        <div className="hidden md:flex items-center gap-6">
            {links.map(link => (
                <a
                    key={link.href}
                    href={link.href}
                    className={`${theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}
                >
                    {link.label}
                </a>
            ))}
        </div>
    );
}

function HeaderActions() {
    const { theme, setTheme, lang, setLang, cartCount, setCartOpen, mobileMenuOpen, setMobileMenuOpen } = useStore();

    return (
        <div className="flex items-center gap-3">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}
            >
                {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}
            >
                <span className="text-sm font-semibold text-blue-400">
                    {lang === 'en' ? 'বাং' : 'EN'}
                </span>
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCartOpen(true)}
                className={`relative p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}
            >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {cartCount}
                    </span>
                )}
            </motion.button>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
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
                        <a href="#audio" onClick={() => setMobileMenuOpen(false)}>{t.audio}</a>
                        <a href="#wearable" onClick={() => setMobileMenuOpen(false)}>{t.wearable}</a>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function Hero() {
    const { theme, t } = useStore();

    return (
        <section className={`min-h-[70vh] flex items-center justify-center relative overflow-hidden ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'
            }`}>
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-600/20 via-cyan-600/20 to-teal-600/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-cyan-600/20 via-blue-600/20 to-purple-600/20 rounded-full blur-3xl"
                />
            </div>

            <div className="container mx-auto px-4 py-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-block mb-4"
                    >
                        <Zap size={48} className="text-blue-500" />
                    </motion.div>

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
                        className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-bold text-lg shadow-2xl shadow-blue-600/50"
                    >
                        {t.shopNow}
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
}

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
                    {badges.map((badge, i) => {
                        const Icon = badge.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`flex items-center gap-4 p-6 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'
                                    }`}
                            >
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
                                    <Icon size={24} className="text-white" />
                                </div>
                                <div>
                                    <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                        {badge.title}
                                    </h3>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                        {badge.desc}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

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

                <div className="flex flex-wrap gap-1 mb-3">
                    {product.specs.slice(0, 2).map((spec, i) => (
                        <span
                            key={i}
                            className={`text-xs px-2 py-1 rounded ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                                }`}
                        >
                            {spec}
                        </span>
                    ))}
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
        </motion.div>
    );
}

function ProductModal() {
    const { selectedProduct, setSelectedProduct, addToCart, theme, lang, t } = useStore();
    const [selectedColor, setSelectedColor] = useState('');

    if (!selectedProduct) return null;

    const handleAddToCart = () => {
        if (!selectedColor) {
            alert(lang === 'en' ? 'Please select a color' : 'অনুগ্রহ করে রঙ নির্বাচন করুন');
            return;
        }
        addToCart(selectedProduct, selectedColor);
        alert(lang === 'en' ? 'Added to cart!' : 'কার্টে যোগ করা হয়েছে!');
    };

    const handleWhatsAppOrder = () => {
        if (!selectedColor) {
            alert(lang === 'en' ? 'Please select a color' : 'অনুগ্রহ করে রঙ নির্বাচন করুন');
            return;
        }

        const message = `Hi! I want to order:
Product: ${selectedProduct.name}
Color: ${selectedColor}
Price: ৳${selectedProduct.price}`;

        window.open(`https://wa.me/8801792552300?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProduct(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 50 }}
                    onClick={(e) => e.stopPropagation()}
                    className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'
                        } shadow-2xl`}
                >
                    <div className="flex justify-between items-start mb-6">
                        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {lang === 'bn' ? selectedProduct.nameBn : selectedProduct.name}
                        </h2>
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <img
                        src={selectedProduct.images[0]}
                        alt={selectedProduct.name}
                        className="w-full h-80 object-cover rounded-xl mb-6"
                    />

                    <div className="mb-6">
                        <h3 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {t.specifications}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedProduct.specs.map((spec, i) => (
                                <span
                                    key={i}
                                    className={`px-3 py-2 rounded-lg text-sm ${theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                                        }`}
                                >
                                    {spec}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className={`block mb-3 font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {t.color}
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {selectedProduct.colors.map(color => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedColor === color
                                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
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

                    <div className="flex items-center gap-4 mb-6">
                        <span className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            ৳{selectedProduct.price}
                        </span>
                        {selectedProduct.originalPrice && (
                            <span className={`text-xl line-through ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
                                ৳{selectedProduct.originalPrice}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAddToCart}
                            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg"
                        >
                            <ShoppingCart size={20} />
                            {t.addToCart}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleWhatsAppOrder}
                            className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg"
                        >
                            <MessageCircle size={20} />
                            {t.orderWhatsApp}
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

function CartSidebar() {
    const { cartOpen, setCartOpen, cart, cartTotal, t, theme, removeFromCart, updateQuantity, lang } = useStore();

    if (!cartOpen) return null;

    const handleCheckout = () => {
        if (cart.length === 0) return;

        const items = cart.map(item =>
            `${item.name} (${item.color}) x${item.quantity} = ৳${item.price * item.quantity}`
        ).join('\n');

        const message = `Hi! I want to order:\n\n${items}\n\nTotal: ৳${cartTotal}`;
        window.open(`https://wa.me/8801792552300?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCartOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            >
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
                            <div className="flex flex-col items-center justify-center h-full">
                                <ShoppingCart size={64} className={theme === 'dark' ? 'text-slate-700' : 'text-slate-300'} />
                                <p className={`mt-4 text-lg ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                    {t.emptyCart}
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setCartOpen(false)}
                                    className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold"
                                >
                                    {t.continueShopping}
                                </motion.button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map((item, index) => (
                                    <div
                                        key={`${item.id}-${item.color}-${index}`}
                                        className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                                            }`}
                                    >
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
                                                    {item.color}
                                                </p>
                                                <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                                    ৳{item.price * item.quantity}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.color, -1)}
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'
                                                        }`}
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className={`w-8 text-center font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.color, 1)}
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'
                                                        }`}
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.id, item.color)}
                                                className="text-red-500 hover:text-red-600 text-sm font-semibold"
                                            >
                                                {t.remove}
                                            </button>
                                        </div>
                                    </div>
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
            </motion.div>
        </AnimatePresence>
    );
}

function Footer() {
    const { theme, lang, t } = useStore();

    return (
        <footer className={`py-12 border-t ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                            <Zap className="text-white" size={24} />
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
                            ? '© 2024 TechBD Gadgets. Demo site by UdyoktaStudio.'
                            : '© ২০২৪ টেকবিডি গ্যাজেটস। UdyoktaStudio দ্বারা ডেমো সাইট।'}
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default function GadgetsDemo() {
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