import { Link } from "react-router-dom";
import { useWishlist } from "../api/useWishlist";
import { useCart } from "../api/useCart";
import { useAuth } from "../context/AuthContext";
import { useAppDispatch } from "../store/hooks";
import { showToast } from "../store/slices/uiSlice";
import type { WishlistItem } from "../types/wishlist";

export function WishlistPage() {
  const { items, count, isLoading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl rounded-3xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/40 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
            ❤️
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sign in to view your Wishlist</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Keep track of your favorite gadgets, clothes, and dream items all in one place.
          </p>
          <Link
            to="/login"
            className="inline-block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition shadow-md"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-400 font-medium">Loading saved wishlist...</p>
      </div>
    );
  }

  const handleMoveToCart = async (item: WishlistItem) => {
    try {
      await addToCart({ productId: item.id, quantity: 1 });
      await removeFromWishlist(item.id);
      dispatch(showToast({ message: `Moved "${item.name.slice(0, 20)}..." to Cart!`, type: "success" }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAllToCart = async () => {
    try {
      for (const item of items) {
        await addToCart({ productId: item.id, quantity: 1 });
        await removeFromWishlist(item.id);
      }
      dispatch(showToast({ message: "All wishlist items moved to cart!", type: "success" }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <span>My Wishlist</span>
              <span className="text-rose-600 text-2xl">❤️</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {count} saved product{count !== 1 ? "s" : ""} in your private collection
            </p>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={handleAddAllToCart}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl transition shadow-md shadow-indigo-200 dark:shadow-none text-xs flex items-center justify-center gap-2"
            >
              <span>🛒 Move All to Cart</span>
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-12 text-center max-w-xl mx-auto my-12 shadow-xs">
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950/40 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-5 text-4xl">
              💔
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
              Found something you love? Tap the heart icon on any product to save it here for later.
            </p>
            <Link
              to="/products"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-2xl transition shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item: WishlistItem) => (
              <div
                key={item.id}
                className="group bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
              >
                {/* Delete from Wishlist button */}
                <button
                  type="button"
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-400 hover:text-rose-600 flex items-center justify-center shadow-sm hover:scale-110 transition"
                  title="Remove"
                >
                  ✕
                </button>

                <Link
                  to={`/products/${item.id}`}
                  className="block relative bg-gray-50 dark:bg-gray-700/50 aspect-square overflow-hidden p-6"
                >
                  <img
                    src={item.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"}
                    alt={item.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.discount_percent > 0 && (
                    <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm">
                      {item.discount_percent}% OFF
                    </span>
                  )}
                </Link>

                <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                      {item.brand}
                    </span>
                    <Link to={`/products/${item.id}`}>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition line-clamp-1">
                        {item.name}
                      </h3>
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <span className="text-xl font-black text-gray-900 dark:text-white">
                      ₹{item.price.toLocaleString()}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleMoveToCart(item)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-indigo-200 dark:shadow-none transition flex items-center gap-1.5"
                    >
                      <span>Move to Cart</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default WishlistPage;
