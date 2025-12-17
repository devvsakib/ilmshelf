import { ArrowRight, Check, MessageCircle, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "../UdyoktaStudio";

function Hero() {
    const { theme, t } = useApp();

    return (
        <section className={`min-h-screen flex items-center justify-center relative overflow-hidden ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'
            }`}>
            {/* Animated linear Background */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/2 -right-1/2 w-full h-full bg-linear-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [90, 0, 90],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-linear-to-tr from-teal-600/20 via-purple-600/20 to-pink-600/20 rounded-full blur-3xl"
                />
            </div>

            <div className="container mx-auto px-4 py-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-purple-600/20 to-pink-600/20 border border-purple-600/30 mb-6"
                    >
                        <Sparkles size={16} className="text-purple-400" />
                        <span className={`text-sm ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
                            {t.footer.tagline}
                        </span>
                    </motion.div>

                    <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>
                        {t.hero.headline}
                    </h1>

                    <p className={`text-lg md:text-xl mb-8 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                        {t.hero.subheadline}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <motion.a
                            href="#demo"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30"
                        >
                            {t.hero.primaryCta}
                            <ArrowRight size={20} />
                        </motion.a>

                        <motion.a
                            href={`https://wa.me/8801792552300`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 ${theme === 'dark'
                                ? 'bg-slate-800 text-white border border-slate-700'
                                : 'bg-white text-slate-900 border border-slate-300'
                                }`}
                        >
                            <MessageCircle size={20} />
                            {t.hero.secondaryCta}
                        </motion.a>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6">
                        {t.hero.trustPoints.map((point, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                className="flex items-center gap-2"
                            >
                                <Check size={16} className="text-green-500" />
                                <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                    {point}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default Hero;