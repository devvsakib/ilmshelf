import { motion } from "motion/react";
import { useApp } from "../UdyoktaStudio";
import { X } from "lucide-react";

function Problem() {
    const { theme, t } = useApp();

    return (
        <section className={`py-20 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto"
                >
                    <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>
                        {t.problem.title}
                    </h2>

                    <div className="space-y-6">
                        {t.problem.points.map((point, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`flex items-start gap-4 p-6 rounded-lg ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'
                                    }`}
                            >
                                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                    <X size={16} className="text-red-500" />
                                </div>
                                <p className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
                                    {point}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className={`text-center mt-8 text-lg font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                            }`}
                    >
                        {t.problem.closing}
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
}

export default Problem;