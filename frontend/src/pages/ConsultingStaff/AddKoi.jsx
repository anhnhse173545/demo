import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Button, message, Space, Select } from "antd"; // Import InputNumber
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/Consulting/AddKoi.css";
const { Option } = Select;

const AddKoi = () => {
  const [loading, setLoading] = useState(false);
  const [varieties, setVarieties] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { consultingStaffId } = useParams();
  const { orderId } = location.state || {};

  useEffect(() => {
    const fetchVarieties = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/variety/list"
        );
        setVarieties(response.data);
      } catch (error) {
        console.error("Error fetching variety list:", error);
        message.error(
          "Failed to fetch variety list: " +
            (error.response?.data?.message || error.message)
        );
      }
    };

    fetchVarieties();
  }, []);

  const handleSubmit = async (values) => {
    if (!orderId) {
      message.error(
        "Missing order ID. Please ensure you navigated here correctly."
      );
      return;
    }

    setLoading(true);

    try {
      for (const fishOrderDetail of values.fishOrderDetails || []) {
        const payload = {
          variety_id: fishOrderDetail.variety_id,
          length: fishOrderDetail.length,
          weight: fishOrderDetail.weight,
          description: fishOrderDetail.description,
          orderId: orderId,
          price: fishOrderDetail.price,
        };

        await axios.post(
          "http://localhost:8080/order-detail/create-fish-and-order-detail",
          payload
        );
      }

      for (const fishPackOrderDetail of values.fishPackOrderDetails || []) {
        const payload = {
          orderId: orderId,
          varietyId: fishPackOrderDetail.variety_id,
          length: fishPackOrderDetail.length,
          weight: fishPackOrderDetail.weight,
          description: fishPackOrderDetail.description,
          quantity: fishPackOrderDetail.quantity,
          packOrderDetailPrice: fishPackOrderDetail.packOrderDetailPrice,
        };

        await axios.post(
          "http://localhost:8080/Koi-pack-Order-detail/create-fish-pack-and-fish-pack-order-detail",
          payload
        );
      }

      message.success(
        "Fish, Fish Packs, and order details created successfully!"
      );
      navigate(`/cs-dashboard/order-list/${consultingStaffId}`);
    } catch (error) {
      let errorMessage =
        "Failed to create fish, fish packs, and order details: ";
      if (error.response) {
        errorMessage +=
          error.response.data?.message ||
          error.response.data ||
          error.response.statusText;
      } else if (error.request) {
        errorMessage +=
          "No response received from server. Please check your network connection.";
      } else {
        errorMessage += error.message;
      }

      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Fish and Fish Pack Details</h2>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <h3>Add Fish</h3>
        <Form.List name="fishOrderDetails">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "variety_id"]}
                    fieldKey={[fieldKey, "variety_id"]}
                    label="Variety ID"
                    rules={[
                      { required: true, message: "Please select Variety ID" },
                    ]}
                  >
                    <Select placeholder="Select Variety ID">
                      {varieties.map((variety) => (
                        <Option key={variety.id} value={variety.id}>
                          {variety.id} - {variety.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "length"]}
                    fieldKey={[fieldKey, "length"]}
                    label="Length (cm)"
                    rules={[
                      { required: true, message: "Please enter Length" },
                      {
                        type: "number",
                        min: 0,
                        message: "Length must be positive",
                      },
                    ]}
                  >
                    <InputNumber placeholder="Length" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "weight"]}
                    fieldKey={[fieldKey, "weight"]}
                    label="Weight (kg)"
                    rules={[
                      { required: true, message: "Please enter Weight" },
                      {
                        type: "number",
                        min: 0,
                        message: "Weight must be positive",
                      },
                    ]}
                  >
                    <InputNumber placeholder="Weight" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "description"]}
                    fieldKey={[fieldKey, "description"]}
                    label="Description"
                  >
                    <Input placeholder="Description" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "price"]}
                    fieldKey={[fieldKey, "price"]}
                    label="Price"
                    rules={[
                      { required: true, message: "Please enter Price" },
                      {
                        type: "number",
                        min: 0,
                        message: "Price must be positive",
                      },
                    ]}
                  >
                    <InputNumber placeholder="Price" />
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Fish
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <h3>Add Fish Pack</h3>
        <Form.List name="fishPackOrderDetails">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "variety_id"]}
                    fieldKey={[fieldKey, "variety_id"]}
                    label="Variety ID"
                    rules={[
                      { required: true, message: "Please select Variety ID" },
                    ]}
                  >
                    <Select placeholder="Select Variety ID">
                      {varieties.map((variety) => (
                        <Option key={variety.id} value={variety.id}>
                          {variety.id} - {variety.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "length"]}
                    fieldKey={[fieldKey, "length"]}
                    label="Length (cm)"
                    rules={[
                      { required: true, message: "Please enter Length" },
                      {
                        type: "number",
                        min: 0,
                        message: "Length must be positive",
                      },
                    ]}
                  >
                    <InputNumber placeholder="Length" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "weight"]}
                    fieldKey={[fieldKey, "weight"]}
                    label="Weight (kg)"
                    rules={[
                      { required: true, message: "Please enter Weight" },
                      {
                        type: "number",
                        min: 0,
                        message: "Weight must be positive",
                      },
                    ]}
                  >
                    <InputNumber placeholder="Weight" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "description"]}
                    fieldKey={[fieldKey, "description"]}
                    label="Description"
                  >
                    <Input placeholder="Description" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "quantity"]}
                    fieldKey={[fieldKey, "quantity"]}
                    label="Quantity"
                    rules={[
                      { required: true, message: "Please enter Quantity" },
                      {
                        type: "number",
                        min: 1,
                        message: "Quantity must be at least 1",
                      },
                    ]}
                  >
                    <InputNumber placeholder="Quantity" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "packOrderDetailPrice"]}
                    fieldKey={[fieldKey, "packOrderDetailPrice"]}
                    label="Price"
                    rules={[
                      { required: true, message: "Please enter Price" },
                      {
                        type: "number",
                        min: 0,
                        message: "Price must be positive",
                      },
                    ]}
                  >
                    <InputNumber placeholder="Price" />
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Fish Pack
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddKoi;
