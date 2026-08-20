import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../api/useCart";
import { useOrders } from "../api/useOrders";
import { useUserProfile } from "../api/useUserProfile";
import { useAuth } from "../context/AuthContext";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setDeliveryOption, setPaymentMethod, clearCartState, type PaymentMethod } from "../store/slices/cartSlice";
import { showToast } from "../store/slices/uiSlice";
import type { CartItem } from "../types/cart";
import type { Address } from "../types/user";

export function CheckoutPage() {
  const { user } = useAuth();
  const { items, totalPrice, totalItems, isLoading: isCartLoading } = useCart();
  const { createOrder, isCreating } = useOrders();
  const { addresses, addAddress, isAddingAddress } = useUserProfile();
  const { appliedCoupon, deliveryOption, paymentMethod } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Selected address state
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  // New address form fields
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || "",
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });

  // Mock payment details
  const [cardDetails, setCardDetails] = useState({ number: "4532 8901 2345 6789", exp: "08/29", cvv: "888", name: user?.name || "Rahul Sharma" });
  const [upiId, setUpiId] = useState("rahul@okaxis");

  useEffect(() => {
    if (addresses && addresses.length > 0 && selectedAddressId === null) {
      const defaultAddr = addresses.find((a: Address) => a.is_default === 1) || addresses[0];
      setSelectedAddressId(defaultAddr.id);
    }
  }, [addresses, selectedAddressId]);

  if (isCartLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-400 font-medium">Preparing checkout gateway...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl rounded-3xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/40 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
            📦
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Items in Cart</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Please add products to your cart before proceeding to the checkout section.
          </p>
          <Link
            to="/products"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl transition shadow-md"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const deliveryCharge = deliveryOption === "express" ? 99 : (totalPrice > 500 ? 0 : 49);
  const estimatedTax = Math.round(totalPrice * 0.05);
  const grandTotal = Math.max(0, totalPrice - discountAmount + deliveryCharge + estimatedTax);

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zip || !newAddress.phone) {
      dispatch(showToast({ message: "Please fill out all address fields", type: "error" }));
      return;
    }

    try {
      const res = await addAddress({ ...newAddress, isDefault: addresses.length === 0 });
      setSelectedAddressId(res.address.id);
      setShowNewAddressForm(false);
      dispatch(showToast({ message: "Address saved successfully!", type: "success" }));
    } catch (err: any) {
      dispatch(showToast({ message: "Failed to save address", type: "error" }));
    }
  };

  const handlePlaceOrder = async () => {
    let finalShippingAddress = "";

    if (selectedAddressId) {
      const addr = addresses.find((a: Address) => a.id === selectedAddressId);
      if (addr) {
        finalShippingAddress = `${addr.full_name} | ${addr.street}, ${addr.city}, ${addr.state} - ${addr.zip} | Phone: ${addr.phone}`;
      }
    }

    if (!finalShippingAddress && (newAddress.street && newAddress.city)) {
      finalShippingAddress = `${newAddress.fullName} | ${newAddress.street}, ${newAddress.city}, ${newAddress.state} - ${newAddress.zip} | Phone: ${newAddress.phone}`;
    }

    if (!finalShippingAddress) {
      dispatch(showToast({ message: "Please select or enter a shipping address", type: "error" }));
      return;
    }

    try {
      const res = await createOrder({
        shippingAddress: finalShippingAddress,
        paymentMethod,
        deliveryOption,
        couponCode: appliedCoupon?.code || null,
        discountAmount,
      });

      dispatch(clearCartState());
      dispatch(showToast({ message: "Order placed successfully! 🎉", type: "success" }));

      if (res.order?.id) {
        navigate(`/order-success/${res.order.id}`);
      } else {
        navigate("/orders");
      }
    } catch (err: any) {
      dispatch(showToast({ message: err.response?.data?.message || "Failed to create order", type: "error" }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-6">
          <Link to="/cart" className="hover:text-indigo-600">← Back to Cart</Link>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-8">
          Checkout & Secure Payment
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Steps Form */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Shipping Address Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2.5">
                  <span className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  Delivery Address
                </h2>

                <button
                  type="button"
                  onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {showNewAddressForm ? "Cancel" : "+ Add New Address"}
                </button>
              </div>

              {/* Saved Addresses List */}
              {addresses.length > 0 && !showNewAddressForm && (
                <div className="space-y-3">
                  {addresses.map((addr: Address) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 transition cursor-pointer ${
                        selectedAddressId === addr.id
                          ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping_addr"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 accent-indigo-600"
                      />
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 dark:text-white text-sm">{addr.full_name}</span>
                          {addr.is_default === 1 && (
                            <span className="bg-gray-100 dark:bg-gray-700 text-[10px] font-bold px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">{addr.street}, {addr.city}, {addr.state} - {addr.zip}</p>
                        <p className="text-gray-400">Phone: {addr.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* New Address Form */}
              {(showNewAddressForm || addresses.length === 0) && (
                <form onSubmit={handleAddNewAddress} className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                        placeholder="Recipient Name"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        required
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                      placeholder="Flat, House No, Street name"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                        placeholder="e.g. Mumbai"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">State</label>
                      <input
                        type="text"
                        required
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                        placeholder="Maharashtra"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">PIN Code</label>
                      <input
                        type="text"
                        required
                        value={newAddress.zip}
                        onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                        placeholder="400001"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isAddingAddress}
                    className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition"
                  >
                    Save Address & Use
                  </button>
                </form>
              )}
            </div>

            {/* Step 2: Delivery Option */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2.5">
                <span className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                Delivery Speed Option
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  onClick={() => dispatch(setDeliveryOption("standard"))}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                    deliveryOption === "standard"
                      ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="text-xs">
                    <span className="font-bold text-gray-900 dark:text-white text-sm block">Standard Shipping</span>
                    <span className="text-gray-400">Delivered in 3-5 business days</span>
                  </div>
                  <span className="font-black text-sm text-emerald-600">
                    {totalPrice > 500 ? "FREE" : "₹49"}
                  </span>
                </label>

                <label
                  onClick={() => dispatch(setDeliveryOption("express"))}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                    deliveryOption === "express"
                      ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="text-xs">
                    <span className="font-bold text-gray-900 dark:text-white text-sm block">⚡ Express 1-Day Dispatch</span>
                    <span className="text-gray-400">Priority expedited delivery</span>
                  </div>
                  <span className="font-black text-sm text-indigo-600 dark:text-indigo-400">₹99</span>
                </label>
              </div>
            </div>

            {/* Step 3: Payment Method Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8 shadow-xs space-y-5">
              <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2.5">
                <span className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                Select Payment Method
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "CARD" as PaymentMethod, label: "Credit/Debit", icon: "💳" },
                  { id: "UPI" as PaymentMethod, label: "UPI & QR", icon: "📱" },
                  { id: "NET_BANKING" as PaymentMethod, label: "Net Banking", icon: "🏦" },
                  { id: "COD" as PaymentMethod, label: "Cash on Delivery", icon: "💵" },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => dispatch(setPaymentMethod(pm.id))}
                    className={`p-3.5 rounded-2xl border-2 text-center transition ${
                      paymentMethod === pm.id
                        ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-bold"
                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium hover:border-gray-300"
                    }`}
                  >
                    <span className="text-2xl block mb-1">{pm.icon}</span>
                    <span className="text-xs">{pm.label}</span>
                  </button>
                ))}
              </div>

              {/* Payment Details Simulator */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700 text-xs">
                {paymentMethod === "CARD" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-gray-500 font-bold">
                      <span>Card Details Simulation</span>
                      <span>🔒 256-bit Encrypted</span>
                    </div>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className="w-full p-2.5 bg-white dark:bg-gray-800 border rounded-xl font-mono text-xs dark:text-white"
                      placeholder="Card Number"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={cardDetails.exp}
                        onChange={(e) => setCardDetails({ ...cardDetails, exp: e.target.value })}
                        className="w-full p-2.5 bg-white dark:bg-gray-800 border rounded-xl font-mono text-xs dark:text-white"
                        placeholder="MM/YY"
                      />
                      <input
                        type="password"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="w-full p-2.5 bg-white dark:bg-gray-800 border rounded-xl font-mono text-xs dark:text-white"
                        placeholder="CVV"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === "UPI" && (
                  <div className="space-y-3">
                    <p className="text-gray-600 dark:text-gray-300">Enter your UPI Virtual Payment Address (VPA):</p>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-gray-800 border rounded-xl font-mono text-xs dark:text-white"
                      placeholder="username@okbank"
                    />
                    <span className="text-[11px] text-emerald-600 block">✓ Google Pay / PhonePe / Paytm Supported</span>
                  </div>
                )}

                {paymentMethod === "NET_BANKING" && (
                  <p className="text-gray-600 dark:text-gray-300">
                    You will be securely redirected to your bank portal after confirming the order.
                  </p>
                )}

                {paymentMethod === "COD" && (
                  <p className="text-gray-600 dark:text-gray-300">
                    Pay the total amount in cash or digital scan when the delivery agent arrives.
                  </p>
                )}
              </div>

            </div>

          </div>

          {/* Order Review Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8 space-y-6 shadow-xs sticky top-24">
              <h2 className="text-lg font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4">
                Order Review ({totalItems} items)
              </h2>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700 pr-1 space-y-3">
                {items.map((item: CartItem) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"}
                        alt={item.name}
                        className="w-12 h-12 object-contain rounded-xl bg-gray-50 dark:bg-gray-700 p-1 border"
                      />
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
                        <p className="text-gray-400">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <span className="font-extrabold text-gray-900 dark:text-white">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost Summary */}
              <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2 text-xs text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900 dark:text-white">₹{totalPrice.toLocaleString()}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST Taxes (5%)</span>
                  <span>₹{estimatedTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Cost</span>
                  <span>{deliveryCharge === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${deliveryCharge}`}</span>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">Total Amount</span>
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    ₹{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isCreating}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-indigo-200 dark:shadow-none active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <span>Confirm & Pay ₹{grandTotal.toLocaleString()}</span>
                    <span>→</span>
                  </>
                )}
              </button>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default CheckoutPage;
