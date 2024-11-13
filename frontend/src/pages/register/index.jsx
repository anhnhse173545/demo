import { toast } from "react-toastify";
import AuthenLayout from "../../components/auth-layout";
import { Button, Form, Input } from "antd";
import api from "../../config/api"; // Assuming api is a configured axios instance

function Register() {
  const handleRegister = async (values) => {
    try {
      // Make a POST request to the provided endpoint
      const { data } = await api.post("http://localhost:8080/accounts/create", values);

      // If registration is successful, show a success message
      toast.success("Account created successfully!");
      
      // You can navigate the user to the login page or another page after registration
      // navigate('/login'); // Uncomment if using react-router-dom for navigation
    } catch (err) {
      // Show error message
      if (err.response && err.response.data) {
        toast.error(err.response.data);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <AuthenLayout>
      <h1>REGISTER</h1>
      
      <Form
        name="userForm"
        layout="vertical"
        onFinish={handleRegister}
        initialValues={{
          role: "customer", // Default value for role, if applicable
        }}
      >
        {/* Name */}
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>

        {/* Phone */}
        <Form.Item
          name="phone"
          label="Phone"
          rules={[{ required: true, message: "Please enter your phone number" }]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>

        {/* Email */}
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        {/* Password */}
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </AuthenLayout>
  );
}

export default Register;
