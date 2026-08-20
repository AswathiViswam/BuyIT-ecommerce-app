import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { showToast } from "../store/slices/uiSlice";

export function Footer() {
  const [email, setEmail] = useState("");
  const dispatch = useAppDispatch();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      dispatch(showToast({ message: "Subscribed to newsletter updates!", type: "success" }));
      setEmail("");
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-400 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-md">
                B
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                BuyIT.
              </span>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Your premier destination for high-performance consumer technology, curated fashion, and modern home essentials.
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm pt-2">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-grow"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-md flex-shrink-0"
              >
                Join
              </button>
            </form>
          </div>

          {/* Column 1: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/products" className="hover:text-white transition">All Products</Link></li>
              <li><Link to="/products" className="hover:text-white transition">Electronics</Link></li>
              <li><Link to="/products" className="hover:text-white transition">Fashion</Link></li>
              <li><Link to="/products" className="hover:text-white transition">Home & Living</Link></li>
              <li><Link to="/products" className="hover:text-white transition">Special Deals</Link></li>
            </ul>
          </div>

          {/* Column 2: Account & Orders */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Account</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/profile" className="hover:text-white transition">My Profile</Link></li>
              <li><Link to="/orders" className="hover:text-white transition">Order Tracking</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition">Saved Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-white transition">Shopping Cart</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Sign In</Link></li>
            </ul>
          </div>

          {/* Column 3: Trust & Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-gray-400">24/7 Helpline: +91 800 123 4567</span></li>
              <li><span className="text-gray-400">Email: support@buyIT.com</span></li>
              <li><span className="text-gray-400">30-Day Free Returns</span></li>
              <li><span className="text-gray-400">100% Authentic Guarantee</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 BuyIT Enterprise Inc. All rights reserved.</p>

          <div className="flex items-center gap-4 text-gray-400 font-semibold text-xs">
            <span>🔒 256-Bit SSL Encryption</span>
            <span>•</span>
            <span>UPI / Cards / COD Supported</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
