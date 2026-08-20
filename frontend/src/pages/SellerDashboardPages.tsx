import { useAuth } from "../context/AuthContext";

export default function SellerDashboardPage() {
  const { user } = useAuth();

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">
        Welcome, {user?.name}
      </h1>

      <p className="mt-2 text-gray-500">
        Manage your products and orders here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
        <section className="p-5 rounded-xl bg-white shadow">
          <p className="text-gray-500">Total Products</p>
          <p className="text-3xl font-bold mt-2">0</p>
        </section>

        <section className="p-5 rounded-xl bg-white shadow">
          <p className="text-gray-500">Orders Received</p>
          <p className="text-3xl font-bold mt-2">0</p>
        </section>

        <section className="p-5 rounded-xl bg-white shadow">
          <p className="text-gray-500">Total Sales</p>
          <p className="text-3xl font-bold mt-2">₹0</p>
        </section>
      </div>
    </main>
  );
}