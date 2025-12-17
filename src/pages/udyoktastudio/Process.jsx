import { motion } from "motion/react";
import { useApp } from "../UdyoktaStudio";
import { ArrowRight } from "lucide-react";

function Process() {
    const { theme, t } = useApp();

    return (
        <section id="process" className={`py-20 ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-5xl mx-auto"
                >
                    <h2 className={`text-3xl md:text-4xl font-bold text-center mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>
                        {t.process.title}
                    </h2>

                    <p className={`text-center mb-12 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                        }`}>
                        {t.process.timeline}
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {t.process.steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`relative p-6 rounded-xl border ${theme === 'dark'
                                    ? 'bg-slate-900 border-slate-800'
                                    : 'bg-white border-slate-200'
                                    } shadow-lg`}
                            >
                                <div className="absolute -top-4 left-6 w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                    {step.num}
                                </div>

                                <h3 className={`font-bold text-xl mt-6 mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                                    }`}>
                                    {step.title}
                                </h3>

                                <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                                    {step.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default Process;