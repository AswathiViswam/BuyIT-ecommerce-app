import { useState } from "react";
import { useProducts } from "../api/useProducts";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setViewMode, setSort, setPage, setQuery, resetFilters } from "../store/slices/searchSlice";
import type { Product } from "../types/product";

export function ProductsPage() {
  const dispatch = useAppDispatch();
  const searchState = useAppSelector((state) => state.search);
  const { query, viewMode, sort, page, filters } = searchState;

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useProducts({
    search: query || undefined,
    category: filters.category || undefined,
    brand: filters.brand.length > 0 ? filters.brand.join(",") : undefined,
    maxPrice: filters.maxPrice || undefined,
    minRating: filters.minRating || undefined,
    inStock: filters.inStockOnly || undefined,
    discount: filters.minDiscount || undefined,
    sort,
    page,
    limit: 12,
  });

  const products: Product[] = data?.products || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const brands = data?.brands || [];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header & Search Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              {filters.category ? `${filters.category}` : "All Products"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Showing {products.length} of {total} products found
            </p>
          </div>

          {/* Active Search & Clear Filter Indicator */}
          <div className="flex flex-wrap items-center gap-3">
            {query && (
              <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-indigo-100 dark:border-indigo-800">
                <span>Keyword: "{query}"</span>
                <button
                  type="button"
                  onClick={() => dispatch(setQuery(""))}
                  className="hover:text-indigo-900 font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {filters.category && (
              <div className="inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-purple-100 dark:border-purple-800">
                <span>Category: {filters.category}</span>
                <button
                  type="button"
                  onClick={() => dispatch(resetFilters())}
                  className="hover:text-purple-900 font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Mobile Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-2xl text-xs font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2 shadow-xs"
            >
              <span>⚙️ Filters</span>
            </button>
          </div>
        </div>

        {/* Toolbar: Sorting & Grid/List View Toggles */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-3 sm:p-4 mb-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
          
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Sort By:</span>
            <select
              value={sort}
              onChange={(e) => dispatch(setSort(e.target.value))}
              className="bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="rating_desc">Best Customer Rating</option>
              <option value="discount_desc">Highest Discount</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => dispatch(setViewMode("grid"))}
              className={`p-1.5 rounded-lg transition ${
                viewMode === "grid"
                  ? "bg-white dark:bg-gray-600 shadow-xs text-indigo-600 dark:text-indigo-300"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              title="Grid View"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h7v7H4zm10 0h7v7h-7zM4 14h7v7H4zm10 0h7v7h-7z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => dispatch(setViewMode("list"))}
              className={`p-1.5 rounded-lg transition ${
                viewMode === "list"
                  ? "bg-white dark:bg-gray-600 shadow-xs text-indigo-600 dark:text-indigo-300"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              title="List View"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
              </svg>
            </button>
          </div>

        </div>

        {/* Main Layout: Sidebar & Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:block md:col-span-3 sticky top-28">
            <FilterSidebar availableBrands={brands} />
          </div>

          {/* Mobile Filter Modal */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-end md:hidden">
              <div className="bg-white dark:bg-gray-800 w-80 h-full overflow-y-auto p-6 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="font-bold text-lg dark:text-white">Filters</h3>
                  <button onClick={() => setMobileFilterOpen(false)} className="text-gray-400 text-lg font-bold">
                    ✕
                  </button>
                </div>
                <FilterSidebar availableBrands={brands} onCloseMobile={() => setMobileFilterOpen(false)} />
              </div>
            </div>
          )}

          {/* Products List/Grid View */}
          <div className="md:col-span-9 space-y-8">
            {isLoading ? (
              <div className="min-h-[50vh] flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-gray-400 font-medium text-sm">Loading catalog items...</p>
              </div>
            ) : isError ? (
              <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 p-8 rounded-3xl text-center">
                <p className="font-bold text-lg mb-2">Failed to load catalog</p>
                <button
                  onClick={() => refetch()}
                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold mt-3"
                >
                  Try Again
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 shadow-xs">
                <span className="text-5xl block mb-3">🔍</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">No products matched your criteria</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 max-w-sm mx-auto">
                  Try adjusting or resetting your applied filters, price range, or search keywords.
                </p>
                <button
                  type="button"
                  onClick={() => dispatch(resetFilters())}
                  className="mt-5 bg-indigo-600 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} viewMode={viewMode} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="pt-8 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => dispatch(setPage(page - 1))}
                      className="px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-700 dark:text-gray-200 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      ← Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => dispatch(setPage(num))}
                        className={`w-10 h-10 rounded-xl text-sm font-bold transition ${
                          num === page
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none"
                            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {num}
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={page >= totalPages}
                      onClick={() => dispatch(setPage(page + 1))}
                      className="px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-700 dark:text-gray-200 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default ProductsPage;
