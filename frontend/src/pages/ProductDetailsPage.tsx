import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProduct } from "../api/useProducts";
import { useCart } from "../api/useCart";
import { useWishlist } from "../api/useWishlist";
import { useAuth } from "../context/AuthContext";
import { useAppDispatch } from "../store/hooks";
import { showToast } from "../store/slices/uiSlice";
import ImageZoom from "../components/ImageZoom";
import ReviewsSection from "../components/ReviewsSection";
import ProductCard from "../components/ProductCard";
import type { Product } from "../types/product";
import type { WishlistItem } from "../types/wishlist";

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: product, isLoading, isError } = useProduct(id);
  const { addToCart, isAdding } = useCart();
  const { items: wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "reviews">("overview");

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">Loading product specifications...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 dark:bg-gray-900">
        <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 p-8 rounded-3xl max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">The requested product could not be loaded or has been discontinued.</p>
          <Link
            to="/products"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl transition shadow-md"
          >
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isWishlisted = wishlistItems.some((w: WishlistItem) => w.id === product.id);

  const handleToggleWishlist = async () => {
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

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await addToCart({ productId: product.id, quantity });
      dispatch(showToast({ message: `Added ${quantity} × ${product.name.slice(0, 20)}... to Cart!`, type: "success" }));
    } catch (err: any) {
      dispatch(showToast({ message: err.response?.data?.message || "Failed to add to cart", type: "error" }));
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await addToCart({ productId: product.id, quantity });
      navigate("/checkout");
    } catch (err: any) {
      dispatch(showToast({ message: err.response?.data?.message || "Failed to proceed to checkout", type: "error" }));
    }
  };

  // Parse specifications object
  let specsObj: Record<string, string> = {};
  if (product.specifications) {
    if (typeof product.specifications === "string") {
      try {
        specsObj = JSON.parse(product.specifications);
      } catch (e) {
        specsObj = { Details: product.specifications };
      }
    } else {
      specsObj = product.specifications as Record<string, string>;
    }
  }

  const imageList = [
    product.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-indigo-600">Products</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Top Product Showcase Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Image Zoom Gallery */}
          <div className="lg:col-span-6">
            <ImageZoom images={imageList} alt={product.name} />
          </div>

          {/* Right: Product Info & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full">
                  {product.brand || "Brand"} • {product.category_name || "General"}
                </span>

                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className={`p-2.5 rounded-2xl border transition ${
                    isWishlisted
                      ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-600"
                      : "border-gray-200 dark:border-gray-700 text-gray-400 hover:text-rose-500"
                  }`}
                  title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <svg className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Star rating summary */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center text-amber-400 text-sm">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>{star <= Math.round(product.rating) ? "★" : "☆"}</span>
                  ))}
                  <span className="font-bold text-gray-800 dark:text-gray-200 ml-1.5">{product.rating}</span>
                </div>
                <span className="text-xs text-gray-400">({product.review_count} customer reviews)</span>
                <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
                  {isOutOfStock ? "Out of Stock" : `${product.stock} Units In Stock`}
                </span>
              </div>

              {/* Price & Discounts */}
              <div className="mt-6 flex items-baseline gap-4">
                <span className="text-4xl font-black text-gray-900 dark:text-white">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ₹{product.original_price.toLocaleString()}
                    </span>
                    <span className="text-xs font-black text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-xl">
                      Save ₹{(product.original_price - product.price).toLocaleString()} ({product.discount_percent}% OFF)
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed mt-4">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="border-t border-gray-100 dark:border-gray-700 pt-6 space-y-6">
              {!isOutOfStock && (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Quantity:</span>
                  <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-700/50 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="px-3.5 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 font-bold disabled:opacity-40 transition"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-bold text-sm text-gray-900 dark:text-white min-w-[36px] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      disabled={quantity >= product.stock}
                      className="px-3.5 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 font-bold disabled:opacity-40 transition"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-gray-400">
                    Total: <strong className="text-gray-900 dark:text-white">₹{(product.price * quantity).toLocaleString()}</strong>
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAdding}
                  className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-500 font-bold py-3.5 px-6 rounded-2xl transition shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {isAdding ? "Adding..." : "Add to Cart"}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock || isAdding}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-2xl transition shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Buy Now Instantly
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Tabs: Specifications & Customer Reviews */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 sm:p-10 shadow-xs">
          
          <div className="flex border-b border-gray-100 dark:border-gray-700 pb-4 gap-6">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`text-sm font-bold pb-2 transition border-b-2 ${
                activeTab === "overview"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Overview & Features
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("specs")}
              className={`text-sm font-bold pb-2 transition border-b-2 ${
                activeTab === "specs"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Technical Specifications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`text-sm font-bold pb-2 transition border-b-2 ${
                activeTab === "reviews"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Customer Reviews ({product.review_count})
            </button>
          </div>

          <div className="pt-6">
            {activeTab === "overview" && (
              <div className="space-y-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-3xl">
                <p>{product.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <span className="text-2xl mb-1 block">🛡️</span>
                    <h5 className="font-bold text-gray-900 dark:text-white text-xs">100% Genuine</h5>
                    <p className="text-xs text-gray-400 mt-0.5">Direct from verified brands</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <span className="text-2xl mb-1 block">🚀</span>
                    <h5 className="font-bold text-gray-900 dark:text-white text-xs">Express Dispatch</h5>
                    <p className="text-xs text-gray-400 mt-0.5">Delivered in 24-48 hours</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <span className="text-2xl mb-1 block">🔄</span>
                    <h5 className="font-bold text-gray-900 dark:text-white text-xs">Hassle-Free Returns</h5>
                    <p className="text-xs text-gray-400 mt-0.5">30-day money-back guarantee</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="max-w-2xl">
                {Object.keys(specsObj).length > 0 ? (
                  <div className="divide-y divide-gray-100 dark:divide-gray-700 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden">
                    {Object.entries(specsObj).map(([key, val]) => (
                      <div key={key} className="grid grid-cols-3 p-3.5 text-xs">
                        <span className="font-bold text-gray-500 dark:text-gray-400">{key}</span>
                        <span className="col-span-2 font-medium text-gray-900 dark:text-white">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Standard specifications apply for this model.</p>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <ReviewsSection productId={product.id} />
            )}
          </div>

        </div>

        {/* Similar Recommended Products */}
        {product.similarProducts && product.similarProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
              Similar Products You May Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {product.similarProducts.map((sim: Product) => (
                <ProductCard key={sim.id} product={sim} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ProductDetailsPage;
