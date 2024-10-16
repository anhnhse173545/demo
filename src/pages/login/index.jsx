
import { Button, Form, Input } from 'antd';
import api from '../../config/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import AuthenLayout from '../../components/auth-layout';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/features/userSlice';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (values) => {
    try {
      const { data } = await api.post('login', values);
      // Successful login
      toast.success('Login successful');
      // Update user state in Redux
      dispatch(login(data));
      // Navigate to homepage
      navigate('/');
    } catch (err) {
      if (err.response && err.response.data) {
        toast.error(err.response.data);
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  const handleRegister = () => {
    // Navigate to the registration page
    navigate('/register');
  };

  return (
    <AuthenLayout>
      <Form labelCol={{ span: 24 }} onFinish={handleLogin}>
        <h1>LOGIN</h1>
        <Form.Item
          label="Phone number"
          name="phonenumber"
          rules={[
            {
              required: true,
              message: 'Please enter your phone number',
            },
          ]}
        >
          <Input placeholder="Enter your phone" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please enter your password',
            },
          ]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
            Login
          </Button>
          <Button type="default" onClick={handleRegister}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </AuthenLayout>
  );
}

export default Login;
