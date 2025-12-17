import { useApp } from "../UdyoktaStudio";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

function Solution() {
    const { theme, t } = useApp();

    return (
        <section className={`py-20 ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <h2 className={`text-3xl md:text-4xl font-bold text-center mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>
                        {t.solution.title}
                    </h2>

                    <p className={`text-center text-lg mb-12 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                        {t.solution.description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        {t.solution.benefits.map((benefit, i) => {
                            const Icon = benefit.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    className={`p-6 rounded-xl border ${theme === 'dark'
                                        ? 'bg-slate-900 border-slate-800'
                                        : 'bg-white border-slate-200'
                                        } shadow-lg`}
                                >
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-4">
                                        <Icon size={24} className="text-white" />
                                    </div>
                                    <h3 className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                                        }`}>
                                        {benefit.text}
                                    </h3>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
export default Solution;