const testimonials = [
  {
    name: "Arjun Mehta",
    role: "Verified Buyer • Tech Reviewer",
    comment: "The Sony WH-1000XM5 headphones arrived within 24 hours in pristine packaging. Noise cancelling is mind-blowing!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  },
  {
    name: "Priya Sengupta",
    role: "Verified Buyer • Fashion Enthusiast",
    comment: "Seamless checkout, multiple payment options, and the Levi's trucker jacket fit perfectly. Definitely my go-to store!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
  {
    name: "Vikram Malhotra",
    role: "Verified Buyer • Fitness Coach",
    comment: "Got the Bowflex adjustable dumbbells with coupon code SAVE20. Saved huge money and the quality is outstanding.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block mb-1">
          Customer Love & Trust
        </span>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          What Our Community Says
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Over 50,000+ satisfied customers across India trust BuyIT. for their daily tech, lifestyle, and fitness essentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-4 text-sm">
                {"★".repeat(t.rating)}
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed italic">
                "{t.comment}"
              </p>
            </div>

            <div className="flex items-center gap-3.5 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-indigo-500/20"
              />
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-none">
                  {t.name}
                </h4>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  {t.role}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TestimonialsSection;
