import { useProducts } from "../api/useProducts";
import HeroCarousel from "../components/HeroCarousel";
import CategoryShowcase from "../components/CategoryShowcase";
import OffersSection from "../components/OffersSection";
import TestimonialsSection from "../components/TestimonialsSection";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import type { Product } from "../types/product";

export function HomePage() {
  const { data: allData, isLoading } = useProducts({ limit: 12 });
  const products: Product[] = allData?.products || [];

  const featured = products.slice(0, 4);
  const newArrivals = products.slice(4, 8);
  const bestSellers = products.slice(8, 12);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 transition-colors">
      
      {/* 1. Hero Banner Carousel */}
      <HeroCarousel />

      {/* 2. Department / Categories Showcase */}
      <CategoryShowcase />

      {/* 3. Featured Products Section */}
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block mb-1">
              Curated Selection
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Featured Trending Products
            </h2>
          </div>

          <Link
            to="/products"
            className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <span>→</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="py-12 flex justify-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Flash Sale / Offers Countdown Section */}
      <OffersSection />

      {/* 5. New Arrivals Showcase */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block mb-1">
                Just Landed
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                New Arrivals
              </h2>
            </div>

            <Link
              to="/products"
              className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Explore New Collection</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 6. Best Sellers Section */}
      {bestSellers.length > 0 && (
        <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500 block mb-1">
                Top Rated By Customers
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Best Sellers
              </h2>
            </div>

            <Link
              to="/products"
              className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              See All Best Sellers →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 7. Testimonials & Community Reviews */}
      <TestimonialsSection />

    </div>
  );
}

export default HomePage;
