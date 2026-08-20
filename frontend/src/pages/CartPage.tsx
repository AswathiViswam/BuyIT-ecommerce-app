import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../api/useCart";
import { useWishlist } from "../api/useWishlist";
import { useAuth } from "../context/AuthContext";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { applyCoupon, removeCoupon } from "../store/slices/cartSlice";
import { validateCoupon } from "../api/couponApi";
import { showToast } from "../store/slices/uiSlice";
import type { CartItem } from "../types/cart";

export function CartPage() {
  const {
    items,
    totalItems,
    totalPrice,
    isLoading,
    isError,
    updateCartItem,
    removeCartItem,
    isUpdating,
    isRemoving,
  } = useCart();
  const { addToWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { appliedCoupon, deliveryOption } = useAppSelector((state) => state.cart);

  const [couponInput, setCouponInput] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl rounded-3xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
            🛒
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sign in to view your cart</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Log in to access your saved items, apply coupon discounts, and checkout securely.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/login"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition shadow-md"
            >
              Sign In Now
            </Link>
            <Link
              to="/products"
              className="w-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 text-gray-700 dark:text-gray-200 font-medium py-3 rounded-xl transition"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">Loading your shopping cart...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 dark:bg-gray-900">
        <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 p-8 rounded-3xl text-center max-w-md">
          <p className="font-bold text-lg mb-2">Failed to retrieve cart items</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl mt-3"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    try {
      setIsValidatingCoupon(true);
      const res = await validateCoupon(couponInput.trim(), totalPrice);
      dispatch(applyCoupon(res.coupon));
      dispatch(showToast({ message: res.message, type: "success" }));
      setCouponInput("");
    } catch (err: any) {
      dispatch(showToast({ message: err.response?.data?.message || "Invalid coupon code", type: "error" }));
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleMoveToWishlist = async (item: CartItem) => {
    try {
      await addToWishlist(item.product_id);
      await removeCartItem(item.id);
      dispatch(showToast({ message: `Moved "${item.name.slice(0, 20)}..." to Wishlist`, type: "success" }));
    } catch (err) {
      console.error(err);
    }
  };

  // Calculations
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const deliveryCharge = deliveryOption === "express" ? 99 : (totalPrice > 500 ? 0 : 49);
  const estimatedTax = Math.round(totalPrice * 0.05); // 5% GST representation
  const grandTotal = Math.max(0, totalPrice - discountAmount + deliveryCharge + estimatedTax);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {totalItems} item{totalItems !== 1 ? "s" : ""} selected for checkout
            </p>
          </div>

          <Link
            to="/products"
            className="hidden sm:inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline"
          >
            ← Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-12 text-center max-w-xl mx-auto my-12 shadow-xs">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-5 text-4xl">
              🛒
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
              Explore our best sellers, high-tech devices, and trendy lifestyle apparel today.
            </p>
            <Link
              to="/products"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-2xl transition shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              Start Shopping Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden shadow-xs">
                {items.map((item: CartItem) => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-5 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition">
                    
                    {/* Item Thumbnail */}
                    <div className="w-24 h-24 bg-gray-50 dark:bg-gray-700 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-600 p-2">
                      <img
                        src={item.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300"}
                        alt={item.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300";
                        }}
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-grow text-center sm:text-left space-y-1">
                      <Link
                        to={`/products/${item.product_id}`}
                        className="text-base font-bold text-gray-900 dark:text-white hover:text-indigo-600 transition line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Unit Price: <span className="font-bold text-gray-800 dark:text-gray-200">₹{item.price.toLocaleString()}</span>
                      </p>

                      <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => handleMoveToWishlist(item)}
                          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Save to Wishlist
                        </button>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => updateCartItem({ itemId: item.id, quantity: item.quantity - 1 })}
                        disabled={item.quantity <= 1 || isUpdating}
                        className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 font-bold disabled:opacity-40"
                      >
                        -
                      </button>
                      <span className="px-3.5 py-1.5 font-bold text-sm text-gray-900 dark:text-white min-w-[36px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartItem({ itemId: item.id, quantity: item.quantity + 1 })}
                        className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Item Total Price */}
                    <div className="text-right min-w-[90px]">
                      <span className="text-base font-black text-gray-900 dark:text-white">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>

                    {/* Delete Item Button */}
                    <button
                      type="button"
                      onClick={() => removeCartItem(item.id)}
                      disabled={isRemoving}
                      className="text-gray-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      title="Remove Item"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>

                  </div>
                ))}
              </div>

              {/* Free delivery tracker */}
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-800 text-xs flex items-center justify-between text-indigo-700 dark:text-indigo-300">
                <span>
                  {totalPrice >= 500
                    ? "🎉 Congratulations! You have unlocked FREE Express Delivery."
                    : `💡 Add ₹${(500 - totalPrice).toLocaleString()} more to get FREE Delivery!`}
                </span>
                <span className="font-bold">{totalPrice >= 500 ? "FREE" : "₹49 Standard"}</span>
              </div>
            </div>

            {/* Order Summary & Coupon Card */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Promo Coupon Form */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider">
                  Apply Discount Coupon
                </h3>

                {appliedCoupon ? (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-emerald-800 dark:text-emerald-300 block">
                        🏷️ Code: {appliedCoupon.code}
                      </span>
                      <span className="text-[11px] text-emerald-600">
                        Saved ₹{appliedCoupon.discountAmount.toLocaleString()} discount
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => dispatch(removeCoupon())}
                      className="text-xs font-bold text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. SAVE20 or WELCOME10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    />
                    <button
                      type="submit"
                      disabled={isValidatingCoupon}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition disabled:opacity-50"
                    >
                      {isValidatingCoupon ? "..." : "Apply"}
                    </button>
                  </form>
                )}

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["SAVE20", "WELCOME10", "FLAT100", "SUPER50"].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCouponInput(c)}
                      className="bg-gray-100 dark:bg-gray-700 text-[10px] font-bold text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-lg hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Cost Breakdown */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8 space-y-5 shadow-xs sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">
                  Order Summary
                </h2>

                <div className="space-y-3 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>Cart Subtotal</span>
                    <span className="font-bold text-gray-900 dark:text-white">₹{totalPrice.toLocaleString()}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Promo Coupon Discount</span>
                      <span>-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Estimated GST / Taxes (5%)</span>
                    <span className="font-bold text-gray-900 dark:text-white">₹{estimatedTax.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span>
                      {deliveryCharge === 0 ? (
                        <strong className="text-emerald-600 uppercase text-[11px]">Free</strong>
                      ) : (
                        <span className="font-bold text-gray-900 dark:text-white">₹{deliveryCharge}</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white block">Grand Total</span>
                    <span className="text-[10px] text-gray-400">All taxes & fees included</span>
                  </div>
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    ₹{grandTotal.toLocaleString()}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-indigo-200 dark:shadow-none active:scale-98 flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

                <p className="text-[11px] text-center text-gray-400 flex items-center justify-center gap-1.5">
                  <span>🔒</span> Safe and Encrypted Checkout
                </p>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default CartPage;
