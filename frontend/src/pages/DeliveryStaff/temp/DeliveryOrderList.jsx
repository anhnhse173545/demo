import React, { useEffect, useState } from "react";
import { Table, Button, Tag, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DeliveryOrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch orders from the API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/fish-order/delivery-staff/AC0003"
      );
      console.log("API Response:", response.data); // Debugging - check API response
      if (Array.isArray(response.data)) {
        setOrders(response.data);
        console.log("Set Orders:", response.data); // Debugging - check set orders
      } else {
        message.error("Unexpected data format from API.");
      }
    } catch (error) {
      message.error("Failed to fetch orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "gold";
      case "In Transit":
        return "blue";
      case "Delivered":
      case "Completed":
        return "green";
      case "Rejected":
        return "volcano";
      case "Cancelled":
        return "red";
      case "Return":
        return "purple";
      default:
        return "default";
    }
  };

  const formatOrderDetails = (fishOrderDetails) => {
    if (!Array.isArray(fishOrderDetails) || fishOrderDetails.length === 0) {
      return "No details available";
    }
    return fishOrderDetails
      .map(
        (detail) =>
          `${detail.fish.variety.name} (${detail.fish.length} cm, ${detail.fish.weight} kg)`
      )
      .join(", ");
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Delivery Address",
      dataIndex: "deliveryAddress",
      key: "deliveryAddress",
      render: (address) => {
        console.log("Rendering Delivery Address:", address); // Debugging
        return address ? address : "No address provided";
      },
    },
    {
      title: "Fish Varieties",
      key: "fishVarieties",
      render: (_, record) => formatOrderDetails(record.fishOrderDetails),
    },
    {
      title: "Total Price",
      dataIndex: "total",
      key: "total",
      render: (total) => {
        console.log("Rendering Total Price:", total); // Debugging
        return total !== undefined && total !== null
          ? `$${total.toFixed(2)}`
          : "N/A";
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => navigate(`/TrackingOrder/${record.id}`)}>
          Track Order
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2>Order List</h2>
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default DeliveryOrderList;
