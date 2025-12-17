import { motion } from "motion/react";
import { useApp } from "../UdyoktaStudio";
import { Check } from "lucide-react";

function Services() {
  const { theme, t } = useApp();

  return (
    <section id="services" className={`py - 20 ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'} `}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className={`text - 3xl md: text - 4xl font - bold text - center mb - 12 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
            } `}>
            {t.services.title}
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {t.services.list.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`flex items - center gap - 3 p - 4 rounded - lg ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'
                  } `}
              >
                <Check size={20} className="text-green-500 flex-shrink-0" />
                <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
                  {service}
                </span>
              </motion.div>
            ))}
          </div>

          <p className={`text - center text - sm italic ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
            } `}>
            {t.services.note}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default Services;