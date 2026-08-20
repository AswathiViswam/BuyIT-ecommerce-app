import { Link } from "react-router-dom";
import { useCategories } from "../api/useProducts";
import type { Category } from "../api/productApi";
import { useAppDispatch } from "../store/hooks";
import { setFilterCategory } from "../store/slices/searchSlice";

const fallbackCategories = [
  { id: 1, name: "Electronics", icon: "💻", color: "from-blue-500 to-indigo-600", count: "120+ Items" },
  { id: 2, name: "Fashion & Apparel", icon: "👟", color: "from-pink-500 to-rose-600", count: "350+ Items" },
  { id: 3, name: "Home & Living", icon: "🛋️", color: "from-amber-500 to-orange-600", count: "80+ Items" },
  { id: 4, name: "Beauty & Wellness", icon: "✨", color: "from-purple-500 to-indigo-600", count: "95+ Items" },
  { id: 5, name: "Sports & Fitness", icon: "🏋️", color: "from-emerald-500 to-teal-600", count: "60+ Items" },
];

export function CategoryShowcase() {
  const { data: serverCategories } = useCategories();
  const dispatch = useAppDispatch();

  const list = serverCategories && serverCategories.length > 0
    ? serverCategories.map((c: Category, i: number) => ({
        ...c,
        icon: fallbackCategories[i]?.icon || "📦",
        color: fallbackCategories[i]?.color || "from-indigo-500 to-purple-600",
        count: fallbackCategories[i]?.count || "Popular",
      }))
    : fallbackCategories;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block mb-1">
            Browse By Department
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Explore Popular Categories
          </h2>
        </div>

        <Link
          to="/products"
          className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          View All Catalog →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {list.map((cat: { id: number; name: string; icon: string; color: string; count: string }) => (
          <Link
            key={cat.id}
            to="/products"
            onClick={() => dispatch(setFilterCategory(cat.name))}
            className="group relative bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center justify-center overflow-hidden"
          >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${cat.color} text-white text-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mb-4`}>
              {cat.icon}
            </div>

            <h3 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-indigo-600 transition line-clamp-1">
              {cat.name}
            </h3>

            <span className="text-xs text-gray-400 mt-1">{cat.count}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategoryShowcase;
