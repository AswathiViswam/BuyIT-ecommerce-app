import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../api/useCart";
import { useWishlist } from "../api/useWishlist";
import { useCategories } from "../api/useProducts";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleTheme } from "../store/slices/themeSlice";
import { setFilterCategory } from "../store/slices/searchSlice";
import { setSearchOverlayOpen } from "../store/slices/uiSlice";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { data: categories } = useCategories();
  const mode = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);
  

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCategoriesDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleSelectCategory = (catName: string) => {
    dispatch(setFilterCategory(catName));
    setCategoriesDropdownOpen(false);
    navigate("/products");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Left Side: Brand Logo & Category Dropdown */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-200 dark:shadow-none group-hover:scale-105 transition-transform">
              B
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
              BuyIT.
            </span>
          </Link>

          {/* Categories Dropdown */}
          <div className="relative hidden lg:block" ref={catRef}>
            <button
              type="button"
              onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <span>Categories</span>
              <svg className={`w-4 h-4 transition-transform ${categoriesDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {categoriesDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 z-50 animate-in">
                <button
                  type="button"
                  onClick={() => handleSelectCategory("")}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 transition"
                >
                  All Categories
                </button>
                {categories?.map((cat: { id: number; name: string }) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.name)}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 transition"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Live Search Bar Trigger */}
        <div className="flex-grow max-w-lg hidden md:block">
          <button
            type="button"
            onClick={() => dispatch(setSearchOverlayOpen(true))}
            className="w-full flex items-center justify-between bg-gray-100 dark:bg-gray-800 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 px-4 py-2.5 rounded-2xl text-sm text-gray-400 transition cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search products, brands, and categories...</span>
            </div>
            <kbd className="hidden sm:inline-block bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-lg text-[10px] font-mono border border-gray-200 dark:border-gray-600 shadow-2xs">
              ⌘K / Search
            </kbd>
          </button>
        </div>

        {/* Right Side: Theme Toggle, Wishlist, Cart, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Mobile Search Button */}
          <button
            type="button"
            onClick={() => dispatch(setSearchOverlayOpen(true))}
            className="p-2.5 rounded-2xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden transition"
            title="Search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Theme Switcher Toggle */}
          <button
            type="button"
            onClick={() => dispatch(toggleTheme())}
            className="p-2.5 rounded-2xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title={`Switch to ${mode === "light" ? "Dark" : "Light"} mode`}
          >
            {mode === "light" ? "🌙" : "☀️"}
          </button>

          {/* Wishlist Icon with Live Badge */}
          <Link
            to="/wishlist"
            className={`relative p-2.5 rounded-2xl border transition ${
              isActive("/wishlist")
                ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-600"
                : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-rose-600 hover:border-rose-200"
            }`}
            title="Wishlist"
          >
            <svg className="w-5 h-5" fill={wishlistCount > 0 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon with Live Badge */}
          <Link
            to="/cart"
            className={`relative p-2.5 rounded-2xl border transition ${
              isActive("/cart")
                ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-600"
                : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-indigo-600 hover:border-indigo-200"
            }`}
            title="Shopping Cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-scale">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          {/* Profile Menu or Login/Register */}
          {isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-xl" />
                  ) : user?.name ? (
                    user.name[0].toUpperCase()
                  ) : (
                    "U"
                  )}
                </div>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${profileDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-3 z-50 animate-in">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="font-bold text-sm text-gray-900 dark:text-white block truncate">
                      {user?.name}
                    </span>
                    <span className="text-xs text-gray-400 block truncate">{user?.email}</span>
                  </div>

                  <div className="py-2 space-y-1 text-sm font-medium">
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 transition"
                    >
                      <span>👤</span> My Profile & Security
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 transition"
                    >
                      <span>📦</span> My Orders History
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 transition"
                    >
                      <span>❤️</span> My Wishlist
                    </Link>
                    {user?.role === "seller" && (
                      <Link
                        to="/seller/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 transition"
                      >
                        <span>📊</span> Seller Dashboard
                      </Link>
                    )}

                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    >
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 font-bold px-3.5 py-2 text-sm transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-2xl text-xs shadow-md shadow-indigo-200 dark:shadow-none transition active:scale-95"
              >
                Get Started
              </Link>
            </div>
          )}

        </div>
  
      </div>
    </header>
  );
}

export default Navbar;
