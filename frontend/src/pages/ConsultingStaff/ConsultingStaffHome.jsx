import React, { useState, useEffect } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  TimeScale,
} from "chart.js";
import { useParams } from "react-router-dom";
import "../../styles/Consulting/ConsultingHome.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  TimeScale
);

const ConsultingStaffHome = () => {
  const [userName, setUserName] = useState("Loading...");
  const [fishOrders, setFishOrders] = useState([]);
  const { consultingStaffId } = useParams();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/accounts/${consultingStaffId}/detail`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setUserName(data.name);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        setUserName("Error fetching name");
      }
    };

    const fetchFishOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/fish-order/consulting-staff/${consultingStaffId}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setFishOrders(data);
      } catch (error) {
        console.error("Failed to fetch fish orders:", error);
      }
    };

    if (consultingStaffId) {
      fetchUserName();
      fetchFishOrders();
    }
  }, [consultingStaffId]);

  // Preparing data for Total Orders by Customer (Bar Chart)
  const customerOrderData = fishOrders.reduce((acc, order) => {
    const customerName = order.customer.name;
    acc[customerName] = (acc[customerName] || 0) + 1;
    return acc;
  }, {});

  const customerOrderChartData = {
    labels: Object.keys(customerOrderData),
    datasets: [
      {
        label: "Number of Orders",
        data: Object.values(customerOrderData),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Preparing data for Total Payment by Farm (Pie Chart)
  const farmPaymentData = fishOrders.reduce((acc, order) => {
    const farmId = order.farmId;
    acc[farmId] = (acc[farmId] || 0) + order.total;
    return acc;
  }, {});

  const farmPaymentChartData = {
    labels: Object.keys(farmPaymentData),
    datasets: [
      {
        data: Object.values(farmPaymentData),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  // Preparing data for Order Payment Status Distribution (Pie Chart)
  const paymentStatusData = fishOrders.reduce((acc, order) => {
    const status = order.paymentStatus;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const paymentStatusChartData = {
    labels: Object.keys(paymentStatusData),
    datasets: [
      {
        data: Object.values(paymentStatusData),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  // Preparing data for Total Price Over Time (Line Chart)
  const orderTotalOverTimeData = {
    labels: fishOrders.map((order) => order.id),
    datasets: [
      {
        label: "Total Price",
        data: fishOrders.map((order) => order.total),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.1,
      },
    ],
  };

  // New: Preparing data for Fish Variety Distribution (Bar Chart)
  const fishVarietyData = fishOrders.reduce((acc, order) => {
    order.fishOrderDetails.forEach((detail) => {
      const variety = detail.fish.fish_variety_name;
      acc[variety] = (acc[variety] || 0) + 1;
    });
    order.fishPackOrderDetails.forEach((detail) => {
      const variety = detail.fishPack.variety.name;
      acc[variety] = (acc[variety] || 0) + 1;
    });
    return acc;
  }, {});

  const fishVarietyChartData = {
    labels: Object.keys(fishVarietyData),
    datasets: [
      {
        label: "Number of Orders",
        data: Object.values(fishVarietyData),
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  // New: Preparing data for Order Status Distribution (Pie Chart)
  const orderStatusData = fishOrders.reduce((acc, order) => {
    const status = order.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const orderStatusChartData = {
    labels: Object.keys(orderStatusData),
    datasets: [
      {
        data: Object.values(orderStatusData),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome, {userName}!</h1>
      <p className="text-xl mb-8">We wish you a good working day!</p>

      {/* Summary Cards */}
      <div className="grid gap-4 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Orders</h2>
          <p className="text-3xl font-bold">{fishOrders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Revenue</h2>
          <p className="text-3xl font-bold">
            $
            {fishOrders
              .reduce((sum, order) => sum + order.total, 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Avg. Order Value</h2>
          <p className="text-3xl font-bold">
            $
            {(
              fishOrders.reduce((sum, order) => sum + order.total, 0) /
                fishOrders.length || 0
            ).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Pending Orders</h2>
          <p className="text-3xl font-bold">
            {fishOrders.filter((order) => order.status === "Pending").length}
          </p>
        </div>
      </div>

      {/* Row 1: Total Orders by Customer (Bar Chart) & Total Payment by Farm (Pie Chart) */}
      <div className="chart-row">
        <div className="chart-container">
          <h2 className="text-xl font-semibold mb-4">
            Total Orders by Customer
          </h2>
          <Bar
            data={customerOrderChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Total Orders by Customer" },
              },
            }}
          />
        </div>

        <div className="pie-chart-container">
          <h2 className="text-xl font-semibold mb-4">Total Payment by Farm</h2>
          <Pie
            data={farmPaymentChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "right" },
                title: { display: true, text: "Total Payment by Farm" },
              },
            }}
          />
        </div>
      </div>

      {/* Row 2: Payment Status Distribution & Total Price Over Time */}
      <div className="chart-row">
        <div className="pie-chart-container">
          <h2 className="text-xl font-semibold mb-4">
            Order Payment Status Distribution
          </h2>
          <Pie
            data={paymentStatusChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "right" },
                title: { display: true, text: "Payment Status Distribution" },
              },
            }}
          />
        </div>

        <div className="chart-container">
          <h2 className="text-xl font-semibold mb-4">Total Price Over Time</h2>
          <Line
            data={orderTotalOverTimeData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Total Price Over Time" },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Order ID",
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: "Total Price ($)",
                  },
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>

      {/* Row 3: Fish Variety Distribution & Order Status Distribution */}
      <div className="chart-row">
        <div className="chart-container">
          <h2 className="text-xl font-semibold mb-4">
            Fish Variety Distribution
          </h2>
          <Bar
            data={fishVarietyChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Fish Variety Distribution" },
              },
            }}
          />
        </div>

        <div className="pie-chart-container">
          <h2 className="text-xl font-semibold mb-4">
            Order Status Distribution
          </h2>
          <Pie
            data={orderStatusChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "right" },
                title: { display: true, text: "Order Status Distribution" },
              },
            }}
          />
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fishOrders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${order.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.paymentStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ConsultingStaffHome;
