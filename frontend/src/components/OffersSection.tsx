import { useState, useEffect } from "react";
import { useProducts } from "../api/useProducts";
import ProductCard from "./ProductCard";
import type { Product } from "../types/product";

export function OffersSection() {
  const { data } = useProducts({ limit: 4 });
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 40 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts: Product[] = data?.products?.filter((p: Product) => p.discount_percent > 0).slice(0, 4) || data?.products?.slice(0, 4) || [];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 rounded-3xl p-8 sm:p-10 text-white mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              ⚡ Flash Deals & Clearance
            </span>
            <h2 className="text-3xl sm:text-4xl font-black">
              Limited Time Deals — Up to 50% OFF
            </h2>
            <p className="text-sm text-pink-100 font-light">
              Use promo code <strong className="bg-white/20 px-2 py-0.5 rounded text-white font-mono font-bold">SAVE20</strong> at checkout for extra savings!
            </p>
          </div>

          {/* Countdown timer */}
          <div className="flex items-center gap-3">
            <div className="bg-black/30 backdrop-blur-md rounded-2xl px-4 py-2.5 text-center min-w-[64px]">
              <span className="text-2xl font-black block leading-none">{String(timeLeft.hours).padStart(2, "0")}</span>
              <span className="text-[10px] uppercase font-bold text-pink-200">Hours</span>
            </div>
            <span className="text-2xl font-black">:</span>
            <div className="bg-black/30 backdrop-blur-md rounded-2xl px-4 py-2.5 text-center min-w-[64px]">
              <span className="text-2xl font-black block leading-none">{String(timeLeft.minutes).padStart(2, "0")}</span>
              <span className="text-[10px] uppercase font-bold text-pink-200">Mins</span>
            </div>
            <span className="text-2xl font-black">:</span>
            <div className="bg-black/30 backdrop-blur-md rounded-2xl px-4 py-2.5 text-center min-w-[64px]">
              <span className="text-2xl font-black block leading-none text-amber-300">{String(timeLeft.seconds).padStart(2, "0")}</span>
              <span className="text-[10px] uppercase font-bold text-pink-200">Secs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {dealProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

export default OffersSection;
