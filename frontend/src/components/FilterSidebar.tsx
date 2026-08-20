import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setFilterCategory,
  toggleFilterBrand,
  setPriceRange,
  setMinRating,
  toggleInStockOnly,
  setMinDiscount,
  resetFilters,
} from "../store/slices/searchSlice";
import { useCategories } from "../api/useProducts";
import type { Category } from "../api/productApi";

interface FilterSidebarProps {
  availableBrands?: string[];
  onCloseMobile?: () => void;
}

export function FilterSidebar({ availableBrands = [], onCloseMobile }: FilterSidebarProps) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.search.filters);
  const { data: categories } = useCategories();

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPriceRange({ min: 0, max: Number(e.target.value) }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
          <span>⚙️</span> Filters
        </h3>
        <button
          type="button"
          onClick={() => dispatch(resetFilters())}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Reset All
        </button>
      </div>

      {/* Categories Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Categories</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          <label className="flex items-center gap-2.5 text-sm cursor-pointer text-gray-700 dark:text-gray-300">
            <input
              type="radio"
              name="category_filter"
              checked={filters.category === ""}
              onChange={() => dispatch(setFilterCategory(""))}
              className="accent-indigo-600"
            />
            All Categories
          </label>
          {categories?.map((cat: Category) => (
            <label key={cat.id} className="flex items-center gap-2.5 text-sm cursor-pointer text-gray-700 dark:text-gray-300">
              <input
                type="radio"
                name="category_filter"
                checked={filters.category === cat.name}
                onChange={() => dispatch(setFilterCategory(cat.name))}
                className="accent-indigo-600"
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Max Price</h4>
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
            ₹{filters.maxPrice.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min="1000"
          max="250000"
          step="5000"
          value={filters.maxPrice}
          onChange={handlePriceChange}
          className="w-full accent-indigo-600 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-gray-400 mt-1">
          <span>₹1,000</span>
          <span>₹2,50,000</span>
        </div>
      </div>

      {/* Brands Filter */}
      {availableBrands.length > 0 && (
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Brands</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {availableBrands.map((brand) => (
              <label key={brand} className="flex items-center gap-2.5 text-sm cursor-pointer text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={filters.brand.includes(brand)}
                  onChange={() => dispatch(toggleFilterBrand(brand))}
                  className="rounded-md accent-indigo-600"
                />
                {brand}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Customer Rating Filter */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Minimum Rating</h4>
        <div className="space-y-1.5">
          {[4, 3, 2].map((stars) => (
            <button
              key={stars}
              type="button"
              onClick={() => dispatch(setMinRating(filters.minRating === stars ? 0 : stars))}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                filters.minRating === stars
                  ? "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <span className="flex items-center gap-1 text-amber-400">
                {"★".repeat(stars)}{"☆".repeat(5 - stars)}
                <span className="text-gray-700 dark:text-gray-300 ml-1.5">{stars}★ & above</span>
              </span>
              {filters.minRating === stars && <span>✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Discount Filter */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Min Discount</h4>
        <div className="grid grid-cols-3 gap-2">
          {[10, 20, 30].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => dispatch(setMinDiscount(filters.minDiscount === d ? 0 : d))}
              className={`py-1.5 rounded-xl text-xs font-bold transition border ${
                filters.minDiscount === d
                  ? "bg-rose-50 border-rose-200 text-rose-600"
                  : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {d}%+
            </button>
          ))}
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">In Stock Only</span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={() => dispatch(toggleInStockOnly())}
            className="toggle-checkbox accent-indigo-600 w-4 h-4 rounded"
          />
        </label>
      </div>

      {onCloseMobile && (
        <button
          type="button"
          onClick={onCloseMobile}
          className="w-full bg-indigo-600 text-white font-bold py-3 rounded-2xl md:hidden mt-4"
        >
          Apply Filters
        </button>
      )}
    </div>
  );
}

export default FilterSidebar;
