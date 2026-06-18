import { useEffect, useState } from "react";
import {
  Package,
  Tags,
  Truck,
  IndianRupee,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";
import { getDashboardStats } from "../api/dashboard";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import { formatCurrency, formatDateTime, getErrorMessage } from "../utils/format";

const typeVariant = { IN: "success", OUT: "danger", ADJUSTMENT: "info" };

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data.data))
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!stats) return null;

  const chartData = stats.lowStockProducts.map((p) => ({
    name: p.name,
    quantity: p.quantity,
    threshold: p.lowStockThreshold,
  }));

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your inventory" />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Products" value={stats.totalProducts} icon={Package} color="indigo" />
        <StatCard label="Categories" value={stats.totalCategories} icon={Tags} color="emerald" />
        <StatCard label="Suppliers" value={stats.totalSuppliers} icon={Truck} color="indigo" />
        <StatCard
          label="Inventory Value"
          value={formatCurrency(stats.totalInventoryValue)}
          icon={IndianRupee}
          color="emerald"
        />
        <StatCard label="Low Stock" value={stats.lowStockCount} icon={AlertTriangle} color="red" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-gray-900">Low Stock Levels</h2>
          {chartData.length === 0 ? (
            <EmptyState title="All stocked up" message="No products are running low." />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="quantity" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-semibold text-gray-900">Low Stock Products</h2>
          {stats.lowStockProducts.length === 0 ? (
            <EmptyState title="All stocked up" message="No products are running low." />
          ) : (
            <div className="space-y-3">
              {stats.lowStockProducts.map((p) => (
                <div key={p._id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.sku} &middot; {p.category?.name}</p>
                  </div>
                  <Badge variant="danger">{p.quantity} left</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">Recent Transactions</h2>
        {stats.recentTransactions.length === 0 ? (
          <EmptyState title="No transactions yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500">
                  <th className="py-2 pr-4">Product</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Quantity</th>
                  <th className="py-2 pr-4">By</th>
                  <th className="py-2 pr-4">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentTransactions.map((t) => (
                  <tr key={t._id}>
                    <td className="py-2 pr-4">
                      <p className="font-medium text-gray-900">{t.product?.name}</p>
                      <p className="text-xs text-gray-500">{t.product?.sku}</p>
                    </td>
                    <td className="py-2 pr-4">
                      <Badge variant={typeVariant[t.type]}>{t.type}</Badge>
                    </td>
                    <td className="py-2 pr-4">{t.quantity}</td>
                    <td className="py-2 pr-4">{t.createdBy?.name}</td>
                    <td className="py-2 pr-4 text-gray-500">{formatDateTime(t.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
