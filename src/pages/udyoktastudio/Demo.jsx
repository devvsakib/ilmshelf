import { motion } from "motion/react";
import { useApp } from "../UdyoktaStudio";
import { Projector, ArrowRight, ImageIcon, LayoutTemplate } from "lucide-react";
import { Link } from "react-router-dom";

function Demo() {
    const { theme, t } = useApp();
    const isDark = theme === "dark";

    return (
        <section
            id="demo"
            className={`relative py-24 overflow-hidden ${isDark ? "bg-slate-900" : "bg-white"
                }`}
        >
            {/* background glow */}
            <div className="pointer-events-none absolute inset-0 flex justify-center">
                <div className="h-[420px] w-[420px] rounded-full bg-purple-500/10 blur-3xl" />
            </div>

            <div className="relative container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mx-auto max-w-5xl"
                >
                    {/* Header */}
                    <div className="mb-14 text-center">
                        <div className="mb-6 flex justify-center">
                            <div
                                className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${isDark
                                        ? "bg-purple-500/10 text-purple-400"
                                        : "bg-purple-100 text-purple-600"
                                    }`}
                            >
                                <LayoutTemplate size={32} />
                            </div>
                        </div>

                        <h2
                            className={`mb-4 text-3xl font-bold md:text-4xl ${isDark ? "text-white" : "text-slate-900"
                                }`}
                        >
                            {t.demo.title}
                        </h2>

                        <p
                            className={`mx-auto max-w-2xl text-lg ${isDark ? "text-slate-400" : "text-slate-600"
                                }`}
                        >
                            {t.demo.text}
                        </p>
                    </div>

                    {/* Demo Cards */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {t.demo.demoList.map((demo, i) => (
                            <motion.div
                                key={demo.link}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -6 }}
                                className={`group rounded-2xl border overflow-hidden transition-all ${isDark
                                        ? "border-slate-700 bg-slate-800"
                                        : "border-slate-200 bg-white"
                                    }`}
                            >
                                {/* Placeholder Image */}
                                <div
                                    className={`relative flex h-44 items-center justify-center ${isDark
                                            ? "bg-gradient-to-br from-slate-700 to-slate-800"
                                            : "bg-gradient-to-br from-slate-100 to-slate-200"
                                        }`}
                                >
                                    <ImageIcon
                                        size={40}
                                        className={`opacity-50 ${isDark ? "text-slate-400" : "text-slate-500"
                                            }`}
                                    />
                                    <span
                                        className={`absolute bottom-3 text-xs tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"
                                            }`}
                                    >
                                        Screenshot coming soon
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3
                                        className={`mb-2 text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"
                                            }`}
                                    >
                                        {demo.name}
                                    </h3>

                                    <Link
                                        to={demo.link}
                                        className={`inline-flex items-center gap-2 text-sm font-medium ${isDark
                                                ? "text-purple-400 hover:text-purple-300"
                                                : "text-purple-600 hover:text-purple-700"
                                            }`}
                                    >
                                        View Demo
                                        <ArrowRight
                                            size={16}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default Demo;
