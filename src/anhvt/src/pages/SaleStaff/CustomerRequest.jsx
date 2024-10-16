import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  DatePicker,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // For page navigation
import moment from "moment";
const { Option } = Select;

const CustomerRequest = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null); // Holds the current customer being edited
  const [form] = Form.useForm();
  const navigate = useNavigate(); // Navigation hook

  // Sample data for customer requests
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Alice",
      contact: "alice@example.com",
      koiType: "Kohaku",
      farm: "Tokyo Koi Farm",
      startDate: "2024-10-15",
      endDate: "2024-10-17",
      tripDetails: "2-day trip to explore koi farming",
      status: "Requested",
    },
    {
      id: 2,
      name: "Bob",
      contact: "bob@example.com",
      koiType: "Asagi",
      farm: "Osaka Koi Farm",
      startDate: "2024-10-18",
      endDate: "2024-10-20",
      tripDetails: "3-day trip focusing on koi breeding",
      status: "Waiting for Approval",
    },
    {
      id: 3,
      name: "Charlie",
      contact: "charlie@example.com",
      koiType: "Shusui",
      farm: "Nagasaki Koi Farm",
      startDate: "2024-10-22",
      endDate: "2024-10-25",
      tripDetails: "Exploring different varieties of koi",
      status: "Declined",
    },
    {
      id: 4,
      name: "Diana",
      contact: "diana@example.com",
      koiType: "Goshiki",
      farm: "Kyoto Koi Farm",
      startDate: "2024-10-28",
      endDate: "2024-10-30",
      tripDetails: "3-day trip to observe koi breeding techniques",
      status: "Approved",
    },
    {
      id: 5,
      name: "Eve",
      contact: "eve@example.com",
      koiType: "Showa",
      farm: "Hiroshima Koi Farm",
      startDate: "2024-11-01",
      endDate: "2024-11-03",
      tripDetails: "Koi auction and farm tour",
      status: "Requested",
    },
    {
      id: 6,
      name: "Frank",
      contact: "frank@example.com",
      koiType: "Tancho",
      farm: "Osaka Koi Farm",
      startDate: "2024-11-05",
      endDate: "2024-11-07",
      tripDetails: "Learning about koi health management",
      status: "Waiting for Approval",
    },
    {
      id: 7,
      name: "Grace",
      contact: "grace@example.com",
      koiType: "Chagoi",
      farm: "Tokyo Koi Farm",
      startDate: "2024-11-09",
      endDate: "2024-11-12",
      tripDetails: "Participating in a koi harvest event",
      status: "Declined",
    },
    {
      id: 8,
      name: "Henry",
      contact: "henry@example.com",
      koiType: "Ogon",
      farm: "Nara Koi Farm",
      startDate: "2024-11-13",
      endDate: "2024-11-16",
      tripDetails: "Exploring rare koi varieties",
      status: "Approved",
    },
  ]);

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    form.setFieldsValue({
      ...customer,
      startDate: moment(customer.startDate), // Convert to moment object
      endDate: moment(customer.endDate), // Convert to moment object
    });
    setIsModalVisible(true);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        setCustomers((prev) =>
          prev.map((customer) =>
            customer.id === editingCustomer.id
              ? { ...customer, ...values }
              : customer
          )
        );
        setIsModalVisible(false);
        message.success("Customer details updated successfully!");
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCreateTripPlan = (customer) => {
    navigate("/create-trip-plan", { state: { customer } });
  };

  const handleViewTripPlan = (customer) => {
    navigate("/view-trip-plan", { state: { customer } });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
    },
    {
      title: "Koi Type",
      dataIndex: "koiType",
      key: "koiType",
    },
    {
      title: "Koi Farm",
      dataIndex: "farm",
      key: "farm",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "Trip Details",
      dataIndex: "tripDetails",
      key: "tripDetails",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => {
        const status = record.status;

        return (
          <>
            {/* Show Edit and Create Trip Plan buttons for Requested status */}
            {status === "Requested" ? (
              <>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => openEditModal(record)}
                  style={{ marginRight: 8 }}
                >
                  Edit
                </Button>

                <Button
                  type="primary"
                  onClick={() => handleCreateTripPlan(record)}
                  style={{ marginRight: 8 }}
                >
                  Create Trip Plan
                </Button>
              </>
            ) : (
              // Show View Trip Plan button for Waiting for Approval, Declined, Approved statuses
              <>
                <Button
                  type="primary"
                  onClick={() => handleViewTripPlan(record)}
                  style={{ marginRight: 8 }}
                >
                  View Trip Plan
                </Button>
              </>
            )}
          </>
        );
      },
    },
  ];

  return (
    <>
      <h2>Customer Requests</h2>
      <Table
        dataSource={customers}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
      <Modal
        title="Edit Customer Request"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Customer Name"
            rules={[
              { required: true, message: "Please enter the customer's name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="contact"
            label="Contact Information"
            rules={[
              { required: true, message: "Please enter contact information!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="koiType"
            label="Koi Type"
            rules={[{ required: true, message: "Please select the Koi type!" }]}
          >
            <Select>
              <Option value="Kohaku">Kōhaku</Option>
              <Option value="Asagi">Asagi</Option>
              <Option value="Bekko">Bekko</Option>
              <Option value="Shusui">Shusui</Option>
              <Option value="Utsurimono">Utsurimono</Option>
              <Option value="Ogon">Ogon</Option>
              <Option value="Goshiki">Goshiki</Option>
              <Option value="Showa">Showa</Option>
              <Option value="Utsuri">Utsuri</Option>
              <Option value="Tancho">Tancho</Option>
              <Option value="Chagoi">Chagoi</Option>
              <Option value="Taisho Sanke">Taisho Sanke</Option>
              <Option value="Kumonryu">Kumonryu</Option>
              <Option value="Showa Sanshoku">Showa Sanshoku</Option>
              <Option value="Matsuba">Matsuba</Option>
              <Option value="Soragoi">Soragoi</Option>
              <Option value="Kawarimono">Kawarimono</Option>
              <Option value="Koromo">Koromo</Option>
              <Option value="Ginrin">Ginrin</Option>
              <Option value="Goromo">Goromo</Option>
              <Option value="Kujaku">Kujaku</Option>
              <Option value="Sanke">Sanke</Option>
              <Option value="Hikarimono">Hikarimono</Option>
              <Option value="Doitsu">Doitsu</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="farm"
            label="Koi Farm"
            rules={[{ required: true, message: "Please select a farm!" }]}
          >
            <Select>
              <Option value="Tokyo Koi Farm">Tokyo Koi Farm</Option>
              {/* Add more farms as needed */}
            </Select>
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[{ required: true, message: "Please select a start date!" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: "Please select an end date!" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="tripDetails"
            label="Trip Details"
            rules={[{ required: true, message: "Please enter trip details!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CustomerRequest;
