import { motion } from "motion/react";
import { useApp } from "../UdyoktaStudio";

function Demo() {
    const { theme, t } = useApp();

    return (
        <section id="demo" className={`py-20 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto text-center"
                >
                    <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>
                        {t.tech.title}
                    </h2>

                    <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                        {t.tech.note}
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        {t.tech.stack.map((tech, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ scale: 1.1 }}
                                className={`px-6 py-3 rounded-full border-2 font-semibold ${theme === 'dark'
                                    ? 'bg-slate-800 border-purple-600/50 text-purple-300'
                                    : 'bg-white border-purple-300 text-purple-700'
                                    }`}
                            >
                                {tech}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
export default Demo;