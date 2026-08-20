import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Product } from "../types/product";
import { useCart } from "../api/useCart";
import { useWishlist } from "../api/useWishlist";
import { useAuth } from "../context/AuthContext";
import { useAppDispatch } from "../store/hooks";
import { showToast } from "../store/slices/uiSlice";
import type { WishlistItem } from "../types/wishlist";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const { addToCart, isAdding } = useCart();
  const { items: wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [added, setAdded] = useState(false);
  const [loadingThis, setLoadingThis] = useState(false);

  const isWishlisted = wishlistItems.some((w: WishlistItem) => w.id === product.id);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        dispatch(showToast({ message: "Removed from Wishlist", type: "info" }));
      } else {
        await addToWishlist(product.id);
        dispatch(showToast({ message: "Saved to Wishlist! ❤️", type: "success" }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (product.stock <= 0) return;

    try {
      setLoadingThis(true);
      await addToCart({ productId: product.id, quantity: 1 });
      setAdded(true);
      dispatch(showToast({ message: `Added "${product.name.slice(0, 20)}..." to Cart!`, type: "success" }));
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setLoadingThis(false);
    }
  };

  const isOutOfStock = product.stock <= 0;

  if (viewMode === "list") {
    return (
      <div className="group bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-5 shadow-xs hover:shadow-xl transition duration-300 flex flex-col sm:flex-row items-center gap-6">
        <Link
          to={`/products/${product.id}`}
          className="relative w-full sm:w-56 aspect-square sm:aspect-auto sm:h-52 bg-gray-50 dark:bg-gray-700/50 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center p-3"
        >
          <img
            src={product.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
            }}
          />
          {product.discount_percent > 0 && (
            <span className="absolute top-3 left-3 bg-rose-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm">
              {product.discount_percent}% OFF
            </span>
          )}
        </Link>

        <div className="flex-grow flex flex-col justify-between h-full w-full">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                {product.brand || "Brand"} • {product.category_name || "General"}
              </span>

              <button
                onClick={handleToggleWishlist}
                className={`p-2 rounded-xl border transition ${
                  isWishlisted
                    ? "bg-rose-50 border-rose-200 text-rose-600"
                    : "border-gray-200 text-gray-400 hover:text-rose-500 hover:bg-gray-50"
                }`}
                title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <svg className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <Link to={`/products/${product.id}`}>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition line-clamp-1">
                {product.name}
              </h2>
            </Link>

            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center text-amber-400 text-xs">
                <span>★</span>
                <span className="font-bold text-gray-800 dark:text-gray-200 ml-1">{product.rating}</span>
              </div>
              <span className="text-xs text-gray-400">({product.review_count} reviews)</span>
              {product.stock <= 5 && !isOutOfStock && (
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md ml-2">
                  Only {product.stock} left
                </span>
              )}
            </div>

            <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-gray-900 dark:text-white">
                ₹{product.price.toLocaleString()}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.original_price.toLocaleString()}
                </span>
              )}
            </div>

            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock || loadingThis || isAdding}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 ${
                isOutOfStock
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : added
                  ? "bg-emerald-600 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 dark:shadow-none"
              }`}
            >
              {added ? "✓ Added" : isOutOfStock ? "Out of Stock" : "+ Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid Mode
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      
      {/* Top badges & Wishlist */}
      <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none">
        {product.discount_percent > 0 ? (
          <span className="bg-rose-600 text-white text-[11px] font-black px-2.5 py-1 rounded-xl shadow-md pointer-events-auto">
            {product.discount_percent}% OFF
          </span>
        ) : <span />}

        <button
          onClick={handleToggleWishlist}
          className={`p-2 rounded-xl backdrop-blur-md shadow-sm border transition pointer-events-auto ${
            isWishlisted
              ? "bg-rose-50/90 border-rose-200 text-rose-600"
              : "bg-white/80 dark:bg-gray-800/80 border-gray-200/50 text-gray-500 hover:text-rose-500"
          }`}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <svg className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <Link
        to={`/products/${product.id}`}
        className="block relative bg-gray-50 dark:bg-gray-700/50 aspect-square overflow-hidden p-6"
      >
        <img
          src={product.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
          }}
        />

        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 dark:bg-black/70 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
            {product.brand || "Brand"}
          </span>

          <Link to={`/products/${product.id}`}>
            <h2 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition line-clamp-1">
              {product.name}
            </h2>
          </Link>

          <div className="flex items-center gap-1.5 mt-1.5 text-xs">
            <div className="flex items-center text-amber-400">
              <span>★</span>
              <span className="font-bold text-gray-800 dark:text-gray-200 ml-1">{product.rating}</span>
            </div>
            <span className="text-gray-400">({product.review_count})</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-gray-900 dark:text-white">
                ₹{product.price.toLocaleString()}
              </span>
            </div>
            {product.original_price && product.original_price > product.price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.original_price.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock || loadingThis || isAdding}
            className={`p-2.5 rounded-xl font-bold transition-all duration-200 ${
              isOutOfStock
                ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                : added
                ? "bg-emerald-600 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 dark:shadow-none active:scale-95"
            }`}
            title="Add to Cart"
          >
            {added ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}

export default ProductCard;