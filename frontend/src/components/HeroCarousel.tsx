import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    tag: "Summer Mega Sale 2026",
    title: "Next-Gen Audio & Smart Tech",
    description: "Experience pure immersion with industry-leading Active Noise Cancellation & 40% OFF this week only.",
    ctaText: "Shop Electronics",
    ctaLink: "/products",
    badge: "⚡ Up to 40% OFF",
    gradient: "from-indigo-900 via-indigo-800 to-purple-950",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
  },
  {
    tag: "Exclusive Flagships",
    title: "Ultra Performance Laptops & Mobile",
    description: "Elevate your productivity with Apple M3 chips and Galaxy AI. Seamless power for creators and professionals.",
    ctaText: "Explore Flagships",
    ctaLink: "/products",
    badge: "🔥 Free Shipping Included",
    gradient: "from-slate-900 via-purple-900 to-indigo-900",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
  },
  {
    tag: "Style & Movement",
    title: "Modern Lifestyle & Streetwear",
    description: "Iconic Nike React foam running shoes and vintage denim trucker jackets tailored for everyday comfort.",
    ctaText: "Shop Fashion",
    ctaLink: "/products",
    badge: "✨ New Season Arrivals",
    gradient: "from-blue-950 via-indigo-900 to-slate-900",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className={`relative overflow-hidden bg-gradient-to-br ${slide.gradient} text-white transition-all duration-700 py-16 lg:py-24 px-4 sm:px-6 lg:px-8 shadow-2xl`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
        
        {/* Left Slide Copy */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-indigo-200 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {slide.tag}
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            {slide.title}
          </h1>

          <p className="text-base sm:text-lg text-indigo-100/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
            {slide.description}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              to={slide.ctaLink}
              className="w-full sm:w-auto bg-white text-gray-900 hover:bg-indigo-50 font-black px-8 py-4 rounded-2xl transition shadow-xl active:scale-95 text-center flex items-center justify-center gap-2"
            >
              <span>{slide.ctaText}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <span className="text-xs font-bold text-indigo-200 bg-white/10 px-4 py-3.5 rounded-2xl backdrop-blur-sm border border-white/10">
              {slide.badge}
            </span>
          </div>
        </div>

        {/* Right Slide Image Preview */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm aspect-square bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl flex items-center justify-center group overflow-hidden">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-contain filter drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

      </div>

      {/* Carousel Dots */}
      <div className="max-w-7xl mx-auto mt-8 flex items-center justify-center gap-2 relative z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrent(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              idx === current ? "w-8 bg-white shadow" : "w-2.5 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

    </section>
  );
}

export default HeroCarousel;
