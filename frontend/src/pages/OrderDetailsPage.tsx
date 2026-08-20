import { useParams, Link } from "react-router-dom";
import { useOrderDetails } from "../api/useOrders";
import type { OrderItem } from "../types/order";

export function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useOrderDetails(id);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Delivered</span>;
      case "shipped":
        return <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Shipped</span>;
      case "processing":
        return <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Processing</span>;
      case "cancelled":
        return <span className="bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Cancelled</span>;
      default:
        return <span className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Pending</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-400 font-medium">Fetching order receipt #{id}...</p>
      </div>
    );
  }

  if (isError || !data?.order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 dark:bg-gray-900">
        <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 p-8 rounded-3xl text-center max-w-md">
          <p className="font-bold text-lg mb-2">Order Not Found</p>
          <p className="text-xs text-gray-500 mb-5">We could not locate this order receipt or permission is missing.</p>
          <Link
            to="/orders"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const { order, items } = data;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/orders" className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold text-sm">
            ← Back to Orders
          </Link>
          <span className="text-xs text-gray-400">
            Placed on {new Date(order.created_at).toLocaleString()}
          </span>
        </div>

        {/* Order Receipt Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xs overflow-hidden mb-8">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 p-6 sm:p-8 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  Order #ORD-{order.id}
                </h1>
                {getStatusBadge(order.status)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Payment: <strong className="capitalize text-gray-800 dark:text-gray-200">{order.payment_method || "Online"} ({order.payment_status})</strong>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[11px] text-gray-400 block">Total Amount Paid</span>
              <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                ₹{order.total_amount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Items Table */}
            <div>
              <h2 className="text-base font-black text-gray-900 dark:text-white mb-4">Purchased Items</h2>
              <div className="divide-y divide-gray-100 dark:divide-gray-700 border-t border-b border-gray-100 dark:border-gray-700">
                {items?.map((item: OrderItem) => (
                  <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden flex-shrink-0 border p-1">
                        <img
                          src={item.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200"}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <Link
                          to={`/products/${item.product_id}`}
                          className="font-bold text-sm text-gray-900 dark:text-white hover:text-indigo-600 transition"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5">
                          ₹{item.price.toLocaleString()} × {item.quantity}
                        </p>
                      </div>
                    </div>

                    <span className="font-extrabold text-sm text-gray-900 dark:text-white">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Destination */}
            <div className="bg-gray-50 dark:bg-gray-700/40 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 text-xs">
              <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-1.5">
                Shipping Destination & Delivery
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {order.shipping_address}
              </p>
            </div>

          </div>

          <div className="bg-gray-50/70 dark:bg-gray-800/80 p-6 sm:px-8 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/products"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition text-xs text-center w-full sm:w-auto shadow-md"
            >
              Continue Shopping
            </Link>

            <Link
              to="/orders"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 font-bold text-xs"
            >
              View All Orders
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

export default OrderDetailsPage;