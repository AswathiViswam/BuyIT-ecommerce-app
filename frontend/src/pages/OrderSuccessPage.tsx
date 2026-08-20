import { useParams, Link } from "react-router-dom";
import { useOrderDetails } from "../api/useOrders";
import type { OrderItem } from "../types/order";

export function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const { data } = useOrderDetails(id);

  const estimatedDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 max-w-2xl w-full p-8 sm:p-10 text-center shadow-xl space-y-8">
        
        {/* Animated Success Badge */}
        <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-inner animate-bounce-short">
          ✓
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Payment & Order Confirmed
          </span>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Thank you for your order!
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Order <strong className="text-gray-900 dark:text-white font-mono">#ORD-{id}</strong> has been registered and is being prepared for dispatch.
          </p>
        </div>

        {/* Estimated Delivery Banner */}
        <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-4 flex items-center justify-between text-xs text-indigo-700 dark:text-indigo-300">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚚</span>
            <span>Estimated Delivery By:</span>
          </div>
          <strong className="font-bold text-sm">{estimatedDate}</strong>
        </div>

        {/* Items Summary Snapshot */}
        {data?.items && data.items.length > 0 && (
          <div className="text-left border-t border-gray-100 dark:border-gray-700 pt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              Purchased Items ({data.items.length})
            </h3>
            <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-48 overflow-y-auto">
              {data.items.map((item: OrderItem) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {item.quantity} × {item.name}
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            to={`/orders/${id}`}
            className="w-full sm:w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl transition shadow-md text-sm text-center"
          >
            Track My Order
          </Link>
          <Link
            to="/products"
            className="w-full sm:w-1/2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-3.5 rounded-2xl transition text-sm text-center"
          >
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}

export default OrderSuccessPage;
