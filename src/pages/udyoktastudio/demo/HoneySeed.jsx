import { motion } from "motion/react";
import {
  ShieldCheck,
  Leaf,
  Truck,
  Star,
  ShoppingCart,
  PhoneCall,
  BadgeCheck
} from "lucide-react";

export default function HoneySeed() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07041d] via-[#0b0725] to-black text-white">

      {/* HERO */}
      <section className="py-28 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Healthy Food, Honest Price
        </motion.h1>

        <p className="text-slate-400 max-w-2xl mx-auto mb-10">
          Pure Sundarbans Honey & Organic Chia Seed trusted by Bangladeshi families
        </p>

        <div className="flex justify-center gap-4">
          <button className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 font-semibold">
            Order Now
          </button>
          <button className="px-6 py-3 rounded-full border border-purple-500 text-purple-400">
            View Products
          </button>
        </div>
      </section>

      {/* WHY BEST */}
      <section className="py-24 px-6">
        <h2 className="text-3xl font-bold text-center mb-16">
          Why Our Food Is Different
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <Leaf />,
              title: "100% Natural",
              text: "No chemicals, no mixing, no compromise"
            },
            {
              icon: <ShieldCheck />,
              title: "Quality Tested",
              text: "Checked before delivery for purity"
            },
            {
              icon: <Truck />,
              title: "Fast Delivery",
              text: "Delivered all over Bangladesh"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10"
            >
              <div className="text-purple-400 mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-slate-400">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-24 px-6">
        <h2 className="text-3xl font-bold text-center mb-16">
          Our Best Selling Products
        </h2>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {[
            {
              name: "Pure Sundarbans Honey",
              price: "৳ 850 / 500gm",
              desc: "Collected directly from Sundarbans forest"
            },
            {
              name: "Organic Chia Seed",
              price: "৳ 650 / 500gm",
              desc: "Premium quality chia for daily nutrition"
            }
          ].map((p, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 overflow-hidden"
            >
              <div className="h-56 bg-black/30 flex items-center justify-center text-slate-500">
                Product Image Placeholder
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">{p.name}</h3>
                <p className="text-slate-400 text-sm mb-3">{p.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-purple-400 font-semibold">
                    {p.price}
                  </span>
                  <button className="flex items-center gap-2 bg-purple-600 px-4 py-2 rounded-full text-sm">
                    <ShoppingCart size={16} /> Add
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 bg-white/5">
        <h2 className="text-3xl font-bold text-center mb-16">
          How Ordering Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            "Choose your product",
            "Confirm order via WhatsApp",
            "Receive at your doorstep"
          ].map((step, i) => (
            <div
              key={i}
              className="text-center p-6 rounded-xl border border-white/10"
            >
              <div className="text-4xl font-bold text-purple-500 mb-3">
                0{i + 1}
              </div>
              <p className="text-slate-300">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <BadgeCheck className="mx-auto text-green-400 mb-4" size={48} />
          <h2 className="text-3xl font-bold mb-4">
            Trusted by 1,000+ Families
          </h2>
          <p className="text-slate-400">
            Repeat customers, honest pricing, and real reviews
          </p>

          <div className="flex justify-center gap-1 mt-6 text-yellow-400">
            <Star /><Star /><Star /><Star /><Star />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-r from-purple-700 to-indigo-700 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Order Healthy Food?
        </h2>
        <p className="mb-8 text-purple-100">
          Message us on WhatsApp and get fresh delivery
        </p>
        <button className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold">
          <PhoneCall size={18} /> Contact Now
        </button>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-slate-500 text-sm">
        © Demo Store — Built by UdyoktaStudio
      </footer>
    </div>
  );
}
