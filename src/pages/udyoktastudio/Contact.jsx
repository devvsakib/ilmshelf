import { motion } from "motion/react";
import { useApp } from "../UdyoktaStudio";
import { ExternalLink, Mail, MessageCircle } from "lucide-react";

function Contact() {
    const { theme, t } = useApp();

    return (
        <section id="contact" className={`py-20 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto text-center"
                >
                    <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>
                        {t.contact.title}
                    </h2>

                    <p className={`text-lg mb-12 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                        {t.contact.subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.a
                            href="https://wa.me/8801792552300"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-semibold flex items-center justify-center gap-3 shadow-lg shadow-green-600/30"
                        >
                            <MessageCircle size={20} />
                            {t.contact.whatsapp}
                        </motion.a>

                        <motion.a
                            href="mailto:UdyoktaStudio@gmail.com"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-3 ${theme === 'dark'
                                ? 'bg-slate-800 text-white border border-slate-700'
                                : 'bg-slate-100 text-slate-900 border border-slate-300'
                                }`}
                        >
                            <Mail size={20} />
                            {t.contact.email}
                        </motion.a>

                        <motion.a
                            href="#demo"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-3 border-2 ${theme === 'dark'
                                ? 'border-purple-600 text-purple-400'
                                : 'border-purple-600 text-purple-600'
                                }`}
                        >
                            <ExternalLink size={20} />
                            {t.contact.demo}
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default Contact;