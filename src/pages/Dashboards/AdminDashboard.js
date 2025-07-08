import React, { useEffect, useState } from "react";
import SummaryApi from "../../common";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FaBoxOpen,
  FaShippingFast,
  FaTruckMoving,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";
// Pie Chart Colors
const COLORS = ["#facc15", "#10b981", "#94a3b8"];

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await fetch(SummaryApi.getOrders.url);
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data.orders);

      const revenue = data.orders.reduce(
        (acc, order) => (order.status === "paid" ? acc + order.amount : acc),
        0
      );
      setTotalRevenue(revenue);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.deliveryStatus === "Ordered"
  ).length;
  const deliveredOrders = orders.filter(
    (o) => o.deliveryStatus === "Delivered"
  ).length;
  const otherOrders = totalOrders - pendingOrders - deliveredOrders;

  const pieData = [
    { name: "Pending", value: pendingOrders },
    { name: "Delivered", value: deliveredOrders },
    { name: "Others", value: otherOrders },
  ];

  const chartDataMap = {};

  orders.forEach((order) => {
    const date = new Date(order.createdAt).toLocaleDateString("en-IN");
    if (!chartDataMap[date]) chartDataMap[date] = 0;
    chartDataMap[date] += order.amount;
  });

  const chartData = Object.entries(chartDataMap)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-7); // Last 7 days

  const getStatusStyle = (status) => {
    switch (status) {
      case "Ordered":
        return {
          icon: <FaBoxOpen className="text-sky-600" />,
          label: "Ordered",
          className: "bg-sky-100 text-sky-700 border-sky-300",
        };
      case "Processing":
        return {
          icon: <FaClock className="text-yellow-600" />,
          label: "Processing",
          className: "bg-yellow-100 text-yellow-800 border-yellow-300",
        };
      case "Shipped":
        return {
          icon: <FaTruckMoving className="text-indigo-600" />,
          label: "Shipped",
          className: "bg-indigo-100 text-indigo-700 border-indigo-300",
        };
      case "In-transit":
        return {
          icon: <FaShippingFast className="text-blue-600" />,
          label: "In-Transit",
          className: "bg-blue-100 text-blue-700 border-blue-300",
        };
      case "Out Of Delivery":
        return {
          icon: <FaTruck className="text-orange-600" />,
          label: "Out For Delivery",
          className: "bg-orange-100 text-orange-700 border-orange-300 truncate",
        };
      case "Delivered":
        return {
          icon: <FaCheckCircle className="text-green-600" />,
          label: "Delivered",
          className: "bg-green-100 text-green-700 border-green-300",
        };
      case "Cancelled":
        return {
          icon: <FaTimesCircle className="text-red-600" />,
          label: "Cancelled",
          className: "bg-red-100 text-red-700 border-red-300",
        };
      default:
        return {
          icon: <FaBoxOpen className="text-gray-500" />,
          label: "Unknown",
          className: "bg-gray-100 text-gray-700 border-gray-300",
        };
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">📊 Dashboard</h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <GradientCard
          label="Total Revenue"
          value={`₹${totalRevenue.toFixed(2)}`}
          colors="from-purple-500 to-pink-600"
        />
        <GradientCard
          label="Total Orders"
          value={totalOrders}
          colors="from-blue-500 to-indigo-600"
        />
        <GradientCard
          label="Pending Orders"
          value={pendingOrders}
          colors="from-yellow-400 to-yellow-600"
        />
        <GradientCard
          label="Delivered Orders"
          value={deliveredOrders}
          colors="from-green-400 to-emerald-600"
        />
      </div>

      {loading ? (
        <div className="text-center text-blue-600">Loading charts...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              🧩 Order Status Overview
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              💰 Revenue (Last 7 Days)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Order Table */}
      <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">
          🕓 Recent Order History
        </h3>
        {loading ? (
          <div className="text-center text-blue-600 py-10">
            Loading orders...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left border-collapse">
              <thead>
                <tr className="bg-slate-800 text-white uppercase text-sm leading-normal">
                  <th className="py-3 px-6">Order ID</th>
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Amount</th>
                  <th className="py-3 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {orders.slice(0, 5).map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 transition duration-200"
                  >
                    <td className="py-3 px-6">{order.order_id}</td>
                    <td className="py-3 px-6">{order.userId?.name || "N/A"}</td>
                    <td className="py-3 px-6">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6">₹{order.amount.toFixed(2)}</td>

                    <td className="py-3 px-6">
                      {(() => {
                        const status = getStatusStyle(
                          order.deliveryStatus || "Ordered"
                        );
                        return (
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${status.className}`}
                          >
                            {status.icon}
                            {status.label}
                          </div>
                        );
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// 🔹 Gradient Card Component
const GradientCard = ({ label, value, colors }) => (
  <div
    className={`bg-gradient-to-r ${colors} text-white p-6 rounded-xl shadow-lg hover:scale-105 transition duration-300`}
  >
    <div>
      <h3 className="text-lg font-semibold">{label}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  </div>
);

export default Dashboard;
