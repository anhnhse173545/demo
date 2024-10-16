import React, { useState } from "react";
import { Form, Input, Button, message, Upload, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Option } = Select;

const AddKoi = ({ onAddKoi }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [fileList, setFileList] = useState([]);
  const [videoList, setVideoList] = useState([]);

  const handleSubmit = (values) => {
    const newKoi = {
      ...values,
      photo: fileList,
      video: videoList,
      status: "Not Pay Yet", // Default status
    };

    onAddKoi(location.state.tripId, newKoi); // Pass the tripId from location
    message.success("Koi added successfully!");
    navigate("/");
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleVideoChange = ({ fileList }) => {
    setVideoList(fileList);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Add New Koi</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Breeder"
          name="breeder"
          rules={[{ required: true, message: "Please enter the breeder name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: "Please select the date" }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item
          label="Koi Name"
          name="koi"
          rules={[{ required: true, message: "Please enter the koi name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: "Please select the koi type" }]}
        >
          <Select placeholder="Select a Koi Type">
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
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please enter the price" }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          label="Payment Method"
          name="paymentMethod"
          rules={[
            { required: true, message: "Please select the payment method" },
          ]}
        >
          <Select placeholder="Select a Payment Method">
            <Option value="Credit Card">Credit Card</Option>
            <Option value="PayPal">PayPal</Option>
            <Option value="Bank Transfer">Bank Transfer</Option>
            <Option value="Cash">Cash</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Upload Photo">
          <Upload
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>Upload Photo</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Upload Video">
          <Upload
            fileList={videoList}
            onChange={handleVideoChange}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>Upload Video</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Koi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddKoi;
