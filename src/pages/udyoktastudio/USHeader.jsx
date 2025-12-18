import React, { useState } from "react";
import { motion } from "motion/react";
import { useApp } from "../UdyoktaStudio";
import { AnimatePresence } from "motion/react";
import { Globe, Menu, Moon, Sun, X } from "lucide-react";

function USHeader() {
    const { lang, setLang, theme, setTheme, t, mobileMenuOpen, setMobileMenuOpen } = useApp();

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 w-full z-50 backdrop-blur-lg border-b ${theme === 'dark'
                ? 'bg-slate-950/80 border-slate-800'
                : 'bg-white/80 border-slate-200'
                }`}
        >
            <title>UdyoktaStudio - From Page to Brand</title>
            <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
                <motion.div
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                >
                    <div className={`w-10 h-10 rounded-lg bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center font-bold ${theme === 'dark' ? 'text-white' : 'text-white'
                        }`}>
                        US
                    </div>
                    <span className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        UdyoktaStudio
                    </span>
                </motion.div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    <a href="#services" className={`${theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>{t.nav.services}</a>
                    <a href="#demo" className={`${theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>{t.nav.demo}</a>
                    <a href="#process" className={`${theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>{t.nav.process}</a>
                    <a href="#contact" className={`${theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>{t.nav.contact}</a>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-700'}`}
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
                        className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800 text-purple-400' : 'bg-slate-100 text-purple-600'}`}
                    >
                        <Globe size={20} />
                    </motion.button>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`md:hidden border-t ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}
                    >
                        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                            <a href="#services" onClick={() => setMobileMenuOpen(false)} className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>{t.nav.services}</a>
                            <a href="#demo" onClick={() => setMobileMenuOpen(false)} className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>{t.nav.demo}</a>
                            <a href="#process" onClick={() => setMobileMenuOpen(false)} className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>{t.nav.process}</a>
                            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>{t.nav.contact}</a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
export default USHeader;
