import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PaymentTripPage = () => {
  const { id } = useParams(); // lấy bookingid từ URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const createTripPayment = async () => {
      try {
        // Gửi yêu cầu POST tới API để tạo thanh toán
        const response = await axios.post(`http://localhost:8080/${id}/payment/api/create-fishpayment`);
        console.log(response.data); // Kiểm tra dữ liệu trả về từ API

        const approvalUrl = response.data.approvalUrl; // Lấy approval URL từ response

        if (approvalUrl) {
          setLoading(false); // Ngừng trạng thái loading
          window.location.href = approvalUrl; // Chuyển hướng đến PayPal
        } else {
          setError('Không tìm thấy approval URL.');
          setLoading(false); // Ngừng loading khi có lỗi
        }
      } catch (err) {
        console.error('Loading.......', err); 
        setError('Loadingggggggg');
        setLoading(false); 
      }
    };

    createTripPayment(); // Gọi hàm tạo thanh toán khi component render
  }, [id]);

  // Hiển thị khi đang loading hoặc có lỗi
  if (loading) return <div>Loading Payment...</div>;
  if (error) return <div>{error}</div>;

  return null; // Không cần render gì vì đã chuyển hướng
};

export default PaymentTripPage;
