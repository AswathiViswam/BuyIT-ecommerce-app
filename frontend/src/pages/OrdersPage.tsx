import { Link } from "react-router-dom";
import { useOrders } from "../api/useOrders";
import type { Order } from "../types/order";

export function OrdersPage() {
  const { orders, isLoading, isError, refetchOrders } = useOrders();

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
        <p className="mt-4 text-gray-400 font-medium">Loading your orders...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 dark:bg-gray-900">
        <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 p-8 rounded-3xl text-center max-w-md">
          <p className="font-bold text-lg mb-2">Failed to load order history</p>
          <button
            onClick={() => refetchOrders()}
            className="bg-indigo-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl mt-3"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              My Orders
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Review your past purchases and track active deliveries
            </p>
          </div>

          <Link
            to="/products"
            className="hidden sm:inline-flex bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 font-bold text-xs px-4 py-2.5 rounded-xl transition"
          >
            Browse Products
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-12 text-center max-w-xl mx-auto my-12 shadow-xs">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-5 text-4xl">
              📦
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No orders placed yet</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
              When you purchase products, your tracking information and receipts will be organized here.
            </p>
            <Link
              to="/products"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-2xl transition shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: Order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-xs hover:shadow-md transition duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-lg font-black text-gray-900 dark:text-white">
                      Order #ORD-{order.id}
                    </span>
                    {getStatusBadge(order.status)}
                    <span className="text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-lg">
                    📍 Destination: <span className="text-gray-700 dark:text-gray-300 font-medium">{order.shipping_address}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-gray-100 dark:border-gray-700">
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-gray-400 block">Total Amount</span>
                    <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                      ₹{order.total_amount.toLocaleString()}
                    </span>
                  </div>

                  <Link
                    to={`/orders/${order.id}`}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default OrdersPage;