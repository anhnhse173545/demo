import  { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PaymentTripPageFull = () => {
  const { id } = useParams(); // lấy bookingid từ URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const createTripPayment = async () => {
      try {
        const response = await axios.post(`http://localhost:8080/${id}/payment/api/update-fishpayment`);
        const approvalUrl = response.data.approvalUrl;

        if (approvalUrl) {
          window.location.href = approvalUrl; // chuyển hướng tới PayPal
        }
      } catch (err) {
        setError('Đã xảy ra lỗi khi tạo thanh toán.');
        setLoading(false);
      }
    };

    createTripPayment();
  }, [id]);

  if (loading) return <div>Loading Payment...</div>;
  if (error) return <div>{error}</div>;

  return null; // Chúng ta không cần render gì vì đã chuyển hướng
};

export default PaymentTripPageFull;
