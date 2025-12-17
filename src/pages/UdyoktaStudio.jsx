import React, { useState, createContext, useContext } from 'react';
import { Moon, Sun, Globe, Menu, X, ArrowRight, Check, Zap, Shield, Smartphone, TrendingUp, Code, Sparkles, MessageCircle, Mail, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import USHeader from './udyoktastudio/USHeader';
import Hero from './udyoktastudio/Hero';
import Problem from './udyoktastudio/Problem';
import Solution from './udyoktastudio/Solution';
import Demo from './udyoktastudio/Demo';
import Services from './udyoktastudio/Services';
import TechStack from './udyoktastudio/TechStack';
import Process from './udyoktastudio/Process';
import Contact from './udyoktastudio/Contact';
import Footer from './udyoktastudio/Footer';

// Language & Theme Context
const AppContext = createContext();

const translations = {
    en: {
        nav: {
            services: "Services",
            demo: "Demo",
            process: "Process",
            contact: "Contact"
        },
        hero: {
            headline: "Turn Your Facebook & Instagram Shop into a Trusted Online Business",
            subheadline: "We build modern e-commerce websites for Bangladeshi sellers — so customers trust you, order confidently, and you scale beyond inbox selling.",
            primaryCta: "View Demo Store",
            secondaryCta: "Talk on WhatsApp",
            trustPoints: ["Built for Bangladeshi sellers", "Mobile-first & fast", "Real demo, no fake promise"]
        },
        problem: {
            title: "Why Only Facebook / Instagram Is Not Enough",
            points: [
                "Customers don't fully trust Facebook pages",
                "Too many inbox messages → missed orders",
                "Hard to get prepaid orders",
                "No brand identity or growth system"
            ],
            closing: "You have traffic — but no trust."
        },
        solution: {
            title: "We Fix This with a Proper E-commerce Website",
            description: "We transform your social media shop into a real website that builds trust, organizes orders, and helps you grow like a brand.",
            benefits: [
                { icon: Shield, text: "Professional & trusted look" },
                { icon: Smartphone, text: "Perfect mobile experience" },
                { icon: Zap, text: "Fast & modern interface" },
                { icon: TrendingUp, text: "Ready for ads & scaling" }
            ]
        },
        demo: {
            title: "See Demo Before You Decide",
            text: "We don't just talk — we show you a live demo.",
            cta: "Open Live Demo Store",
            note: "No signup required"
        },
        services: {
            title: "What We Build for You",
            list: [
                "Custom e-commerce website",
                "Mobile-first modern UI",
                "Product & order management",
                "WhatsApp order integration",
                "Facebook / Instagram pixel ready",
                "Fast & secure setup"
            ],
            note: "Designed for Bangladeshi buyer behavior"
        },
        tech: {
            title: "Built with Modern Technology",
            note: "No outdated templates. Fully modern & scalable.",
            stack: ["React.js", "Vite", "Tailwind CSS v4", "Shadcn UI", "Framer Motion"]
        },
        process: {
            title: "Simple 4-Step Process",
            steps: [
                { num: "01", title: "Understand", desc: "We learn about your business & products" },
                { num: "02", title: "Design & Build", desc: "Create your modern website" },
                { num: "03", title: "Review", desc: "Refine based on your feedback" },
                { num: "04", title: "Launch", desc: "Go live with guidance & support" }
            ],
            timeline: "Clear process, fast delivery"
        },
        contact: {
            title: "Let's Build Trust for Your Business",
            subtitle: "No pressure. No fake commitments. Just honest conversation.",
            whatsapp: "WhatsApp Now",
            email: "Send Email",
            demo: "View Demo"
        },
        footer: {
            tagline: "From Page to Brand",
            about: "UdyoktaStudio helps Bangladeshi Facebook & Instagram sellers become real online businesses.",
            rights: "All rights reserved."
        }
    },
    bn: {
        nav: {
            services: "সার্ভিস",
            demo: "ডেমো",
            process: "প্রসেস",
            contact: "যোগাযোগ"
        },
        hero: {
            headline: "আপনার Facebook ও Instagram পেজকে একটি বিশ্বাসযোগ্য অনলাইন বিজনেসে রূপ দিন",
            subheadline: "আমরা Bangladeshi সেলারদের জন্য modern e-commerce website তৈরি করি, যাতে কাস্টমার বিশ্বাস করে, সহজে অর্ডার করে এবং আপনার বিজনেস স্কেল করতে পারে।",
            primaryCta: "ডেমো স্টোর দেখুন",
            secondaryCta: "WhatsApp এ কথা বলুন",
            trustPoints: ["Bangladeshi সেলারদের জন্য", "Mobile-first ও দ্রুত", "Real demo, কোনো ভুয়া প্রতিশ্রুতি নেই"]
        },
        problem: {
            title: "কেন শুধু Facebook / Instagram যথেষ্ট না",
            points: [
                "কাস্টমার Facebook page দেখে পুরোপুরি বিশ্বাস পায় না",
                "Inbox-এ বেশি message → order miss হয়",
                "Prepaid order পাওয়া কঠিন",
                "Brand value ও growth system নেই"
            ],
            closing: "Traffic আছে, কিন্তু trust নেই।"
        },
        solution: {
            title: "একটি Proper E-commerce Website দিয়েই সমাধান",
            description: "আমরা আপনার social media shop-কে একটি real website-এ রূপ দেই, যেটা buyer-দের কাছে trustworthy লাগে এবং order process সহজ করে।",
            benefits: [
                { icon: Shield, text: "Professional ও trusted look" },
                { icon: Smartphone, text: "Perfect mobile experience" },
                { icon: Zap, text: "দ্রুত ও modern interface" },
                { icon: TrendingUp, text: "Ads ও scaling-এর জন্য ready" }
            ]
        },
        demo: {
            title: "Decision নেওয়ার আগে Demo দেখুন",
            text: "আমরা শুধু কথা বলি না — live demo দেখাই।",
            cta: "Live Demo Store খুলুন",
            note: "কোনো signup লাগবে না"
        },
        services: {
            title: "আমরা আপনার জন্য কী তৈরি করি",
            list: [
                "Custom e-commerce website",
                "Mobile-first modern UI",
                "Product ও order management",
                "WhatsApp order integration",
                "Facebook / Instagram pixel ready",
                "দ্রুত ও secure setup"
            ],
            note: "Bangladeshi buyer behavior মাথায় রেখে ডিজাইন করা"
        },
        tech: {
            title: "Modern Technology দিয়ে তৈরি",
            note: "কোনো পুরনো template নয়। সম্পূর্ণ modern ও scalable।",
            stack: ["React.js", "Vite", "Tailwind CSS v4", "Shadcn UI", "Framer Motion"]
        },
        process: {
            title: "সহজ ৪-ধাপ প্রসেস",
            steps: [
                { num: "০১", title: "বুঝি", desc: "আপনার business ও product বুঝি" },
                { num: "০২", title: "Design ও Build", desc: "আপনার modern website তৈরি করি" },
                { num: "০৩", title: "Review", desc: "আপনার feedback অনুযায়ী refine করি" },
                { num: "০৪", title: "Launch", desc: "Guidance ও support সহ live করি" }
            ],
            timeline: "Clear process, দ্রুত delivery"
        },
        contact: {
            title: "আপনার বিজনেসের জন্য Trust তৈরি করি",
            subtitle: "কোনো pressure নেই। কোনো ভুয়া commitment নেই। শুধু সৎ কথাবার্তা।",
            whatsapp: "WhatsApp করুন",
            email: "Email পাঠান",
            demo: "ডেমো দেখুন"
        },
        footer: {
            tagline: "Page থেকে Brand",
            about: "UdyoktaStudio Bangladeshi Facebook ও Instagram সেলারদের real online business বানাতে সাহায্য করে।",
            rights: "সকল অধিকার সংরক্ষিত।"
        }
    }
};

function AppProvider({ children }) {
    const [lang, setLang] = useState('en');
    const [theme, setTheme] = useState('dark');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const t = translations[lang];

    return (
        <AppContext.Provider value={{ lang, setLang, theme, setTheme, t, mobileMenuOpen, setMobileMenuOpen }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}


// Main App
export default function USApp() {
    return (
        <AppProvider>
            <Main />
        </AppProvider>
    );
}

function Main() {
    const { theme } = useApp();

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
            <USHeader />
            <Hero />
            <Problem />
            <Solution />
            <Demo />
            <Services />
            <TechStack />
            <Process />
            <Contact />
            <Footer />
        </div>
    );
}
