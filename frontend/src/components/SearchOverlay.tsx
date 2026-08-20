import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setQuery, addRecentSearch, clearRecentSearches } from "../store/slices/searchSlice";
import { setSearchOverlayOpen } from "../store/slices/uiSlice";
import { useProducts } from "../api/useProducts";
import type { Product } from "../types/product";

export function SearchOverlay() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.searchOverlayOpen);
  const recentSearches = useAppSelector((state) => state.search.recentSearches);

  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: searchResults, isLoading } = useProducts({ search: inputVal, limit: 5 });

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectSearch = (term: string) => {
    dispatch(addRecentSearch(term));
    dispatch(setQuery(term));
    dispatch(setSearchOverlayOpen(false));
    navigate("/products");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      handleSelectSearch(inputVal.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in">
        
        {/* Search Input Field */}
        <form onSubmit={handleFormSubmit} className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <svg className="w-6 h-6 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          <input
            ref={inputRef}
            type="text"
            placeholder="Search headphones, laptops, running shoes, fragrances..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 text-lg font-medium focus:outline-none"
          />

          {inputVal && (
            <button
              type="button"
              onClick={() => setInputVal("")}
              className="text-gray-400 hover:text-gray-600 text-sm font-bold p-1"
            >
              ✕
            </button>
          )}

          <button
            type="button"
            onClick={() => dispatch(setSearchOverlayOpen(false))}
            className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-xl text-xs font-bold transition"
          >
            ESC
          </button>
        </form>

        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          
          {/* Live Suggestions if typing */}
          {inputVal.trim() && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Live Matching Products</h4>
              {isLoading ? (
                <div className="py-4 text-center text-sm text-gray-400">Searching matching catalog...</div>
              ) : searchResults?.products && searchResults.products.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.products.map((p: Product) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        dispatch(setSearchOverlayOpen(false));
                        navigate(`/products/${p.id}`);
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-indigo-50 dark:hover:bg-gray-800 transition text-left"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"}
                          alt={p.name}
                          className="w-10 h-10 object-contain rounded-lg bg-gray-50 dark:bg-gray-700 p-1"
                        />
                        <div>
                          <span className="font-bold text-sm text-gray-900 dark:text-white block line-clamp-1">
                            {p.name}
                          </span>
                          <span className="text-xs text-gray-400">{p.brand} • {p.category_name}</span>
                        </div>
                      </div>
                      <span className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">
                        ₹{p.price.toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 py-2">No matching products found.</p>
              )}
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Recent Searches</h4>
                <button
                  type="button"
                  onClick={() => dispatch(clearRecentSearches())}
                  className="text-xs text-gray-400 hover:text-rose-500 transition"
                >
                  Clear History
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectSearch(term)}
                    className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-700 dark:text-gray-300 hover:text-indigo-600 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition"
                  >
                    <span>🕒</span>
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Popular Searches 🔥</h4>
            <div className="flex flex-wrap gap-2">
              {["Noise Cancelling Headphones", "MacBook Air", "Galaxy S24", "Nike Air Max", "Hue Smart Bulb"].map(
                (term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleSelectSearch(term)}
                    className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 px-3.5 py-1.5 rounded-xl text-xs font-bold transition border border-indigo-100 dark:border-indigo-800"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default SearchOverlay;
