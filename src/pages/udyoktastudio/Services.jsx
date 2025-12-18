import { motion } from "motion/react";
import {
  ShoppingCart,
  Smartphone,
  Package,
  MessageCircle,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "../UdyoktaStudio";

const ICONS = [
  ShoppingCart,
  Smartphone,
  Package,
  MessageCircle,
  BarChart3,
  ShieldCheck,
];

function Services() {
  const { theme, t } = useApp();
  const isDark = theme === "dark";

  return (
    <section
      id="services"
      className={`relative py-24 overflow-hidden ${isDark ? "bg-slate-950" : "bg-slate-50"
        }`}
    >
      <div className="pointer-events-none absolute inset-0 flex justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="h-[520px] w-[520px] rounded-full bg-purple-600/20 blur-[140px]"
        />
      </div>

      {/* animated background grid */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="pointer-events-none absolute inset-0"
      >
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={isDark ? "#a855f7" : "#7c3aed"}
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </motion.div>

      <div className="relative container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-5xl"
        >
          {/* Title */}
          <h2
            className={`mb-12 text-center text-3xl font-bold md:text-4xl ${isDark ? "text-white" : "text-slate-900"
              }`}
          >
            {t.services.title}
          </h2>

          {/* Infography cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.services.list.map((service, i) => {
              const Icon = ICONS[i];
              return (
                <motion.div
                  whileHover={{ y: -10, rotateX: 4, rotateY: -4 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className={`group relative rounded-2xl p-px ${
                    isDark
                      ? "border-slate-800 bg-slate-900"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  {/* glow */}
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-purple-500/40 via-fuchsia-500/20 to-transparent opacity-0 group-hover:opacity-100 transition" />

                  <div className="relative rounded-2xl backdrop-blur p-6">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${isDark
                          ? "bg-purple-500/10 text-purple-400"
                          : "bg-purple-100 text-purple-600"
                        }`}
                    >
                      <Icon size={24} />
                    </div>

                    <p
                      className={`text-sm font-medium leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                    >
                      {service}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className={`mt-12 text-center text-sm italic ${isDark ? "text-purple-400" : "text-purple-600"
              }`}
          >
            {t.services.note}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

export default Services;
