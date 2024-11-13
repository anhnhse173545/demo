import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  message,
  Card,
  Descriptions,
  Steps,
  Tabs,
  Typography,
  Select,
} from "antd";
import axios from "axios";

const { Step } = Steps;
const { TabPane } = Tabs;
const { Title } = Typography;
const { Option } = Select;

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("1");
  const [updating, setUpdating] = useState(false);

  // Fetch orders from the API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/fish-order/delivery-staff/AC0003"
      );
      console.log(response.data); // Check the structure of the API response
      setOrders(response.data);
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
      case "Deposited":
        return "gold";
      case "In Transit":
        return "blue";
      case "Delivering":
        return "cyan";
      case "Completed":
        return "green";
      case "Rejected":
        return "volcano";
      default:
        return "default";
    }
  };

  const getStatusStep = (status) => {
    switch (status) {
      case "Deposited":
        return 0;
      case "In Transit":
        return 1;
      case "Delivering":
        return 2;
      case "Rejected":
      case "Completed":
        return 3;
      default:
        return 0;
    }
  };

  // Update order status
  const updateOrderStatus = async (order, newStatus) => {
    setUpdating(true); // Start the loading state for updating
    try {
      // Ensure the payload structure is correct
      const payload = { status: newStatus };

      // Log the values to ensure you're sending correct data
      console.log("Updating Order ID:", order.id);
      console.log("Updating Farm ID:", order.farmId); // Check if farmId exists
      console.log("New Status:", newStatus);

      // Check the correct API endpoint format
      const endpoint = `http://localhost:8080/fish-order/${order.id}/${order.farmId}/update`;
      console.log("API Endpoint:", endpoint); // Log the endpoint

      // Send the PUT request to update the status
      const response = await axios.put(endpoint, payload);

      // Log the response for debugging
      console.log("Update Response:", response.data);

      // If the update is successful, show a success message
      message.success("Status updated successfully!");

      // Refresh the orders after the update
      fetchOrders();
    } catch (error) {
      // Log the error for debugging purposes
      console.error("Error updating status:", error);

      // Extract and display a user-friendly error message
      const errorMessage = error.response
        ? error.response.data.message
        : "Failed to update status.";
      message.error(errorMessage);
    } finally {
      setUpdating(false); // End the loading state for updating
    }
  };

  // Handle viewing order details
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setActiveTab("2");
  };

  // Handle status change
  const handleStatusChange = (order, newStatus) => {
    updateOrderStatus(order, newStatus);
  };

  // Table columns
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
      render: (address) => (address ? address : "No address provided"), // Ensure fallback if missing
    },
    {
      title: "Fish Varieties",
      key: "fishVarieties",
      render: (_, record) =>
        record.fishOrderDetails
          .map(
            (detail) =>
              `${detail.fish.variety.name} (${detail.fish.length} cm, ${detail.fish.weight} kg)`
          )
          .join(", "),
    },
    {
      title: "Total Price",
      dataIndex: "total",
      key: "total",
      render: (total) => (total ? `$${total.toFixed(2)}` : "N/A"), // Handle missing total
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
        <Button onClick={() => handleViewDetails(record)}>View Details</Button>
      ),
    },
    {
      title: "Update Status",
      key: "updateStatus",
      render: (_, record) => (
        <Select
          defaultValue={record.status}
          style={{ width: 160 }}
          onChange={(value) => handleStatusChange(record, value)}
          disabled={updating}
        >
          <Option value="Deposited">Deposited</Option>
          <Option value="In Transit">In Transit</Option>
          <Option value="Delivering">Delivering</Option>
          <Option value="Rejected">Rejected</Option>
          <Option value="Completed">Completed</Option>
        </Select>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Order Tracking</Title>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Order List" key="1">
          <Table
            dataSource={orders}
            columns={columns}
            rowKey="id"
            loading={loading}
          />
        </TabPane>
        <TabPane tab="Order Details" key="2">
          {selectedOrder ? (
            <Card title={`Order Details: ${selectedOrder.id}`}>
              <Steps current={getStatusStep(selectedOrder.status)}>
                <Step title="Deposited" description="Order has been placed" />
                <Step title="In Transit" description="Order is on the way" />
                <Step
                  title="Delivering"
                  description="Order is being delivered"
                />
                <Step
                  title="Rejected/Completed"
                  description="Order rejected or completed"
                />
              </Steps>
              <Descriptions
                title="Order Information"
                bordered
                style={{ marginTop: 20 }}
              >
                <Descriptions.Item label="Delivery Address">
                  {selectedOrder.deliveryAddress || "No address provided"}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status.toUpperCase()}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Total Price">
                  {selectedOrder.total
                    ? `$${selectedOrder.total.toFixed(2)}`
                    : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Fish Order Details" span={3}>
                  {selectedOrder.fishOrderDetails.map((detail) => (
                    <div key={detail.id}>
                      {detail.fish.variety.name} (Length: {detail.fish.length}{" "}
                      cm, Weight: {detail.fish.weight} kg, Price: $
                      {detail.fish_price})
                    </div>
                  ))}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          ) : (
            <div>Select an order to view details</div>
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default OrderTracking;
