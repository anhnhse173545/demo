import React, { useState } from "react";
import { Form, Input, Button, DatePicker, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

const CreateTripPlan = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation(); // Retrieve customer data passed via state
  const customer = location.state?.customer; // Get customer data from the previous page

  const onFinish = (values) => {
    // Simulate saving trip details and navigate back to CustomerRequest page
    message.success("Trip plan created successfully!");

    // Pass the trip plan data back to CustomerRequest.jsx (can use state management here)
    navigate("/customer-request", {
      state: { ...customer, tripPlan: values, status: "Waiting for Approval" },
    });
  };
  const handleEdit = () => {
    navigate("/create-trip-plan", { state: { customer } });
  };

  // Then add the Edit button in the render method
  <Button type="primary" onClick={handleEdit} style={{ marginTop: "20px" }}>
    Edit Trip Plan
  </Button>;
  return (
    <div>
      <h2>Create Trip Plan for {customer?.name}</h2>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="itinerary"
          label="Itinerary"
          rules={[
            { required: true, message: "Please enter the trip itinerary!" },
          ]}
        >
          <Input.TextArea placeholder="Describe the trip itinerary..." />
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

        <Form.Item name="additionalDetails" label="Additional Details">
          <Input.TextArea placeholder="Any additional information?" />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Submit Trip Plan
        </Button>
      </Form>
    </div>
  );
};

export default CreateTripPlan;
