import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle2, XCircle, Calendar, User, Phone, Mail, FileText } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";

export default function BookingHistoryPage() {
  const { id } = useParams(); // Lấy customerId từ URL
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/booking/customer/${id}`);
        const filteredBookings = response.data.filter(booking =>
          booking.status === 'Completed' || booking.status === 'Canceled'
        );
        setBookingHistory(filteredBookings);
      } catch (err) {
        setError('Lỗi khi tải lịch sử đặt chỗ.');
      } finally {
        setLoading(false);
      }
    };

    if (id) { // Kiểm tra nếu customerId hợp lệ
      fetchBookingHistory();
    } else {
      setError("Không tìm thấy ID khách hàng.");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-12 w-[300px]" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-[250px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="text-lg font-semibold">Lỗi</AlertTitle>
        <AlertDescription className="text-sm">{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8 p-6 min-h-screen" style={{
      backgroundImage: 'url("https://img.freepik.com/free-photo/beautiful-exotic-colorful-fish_23-2150737625.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <motion.h1 
        className="text-4xl font-bold tracking-tight text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Customer Booking History
      </motion.h1>
      
      {bookingHistory.length === 0 ? (
        <Alert className="bg-white/50 backdrop-blur-sm border-gray-200">
          <AlertCircle className="h-5 w-5 text-blue-500" />
          <AlertTitle className="text-lg font-semibold text-gray-900">Thông báo</AlertTitle>
          <AlertDescription className="text-gray-600">
            Không có lịch sử đặt chỗ với trạng thái đã hoàn thành hoặc đã hủy.
          </AlertDescription>
        </Alert>
      ) : (
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {bookingHistory.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden bg-white/70 backdrop-blur-lg border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gray-50 border-b border-gray-200">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span className="font-semibold text-gray-700">Booking Id: {booking.id}</span>
                    <Badge 
                      variant={booking.status === 'Completed' ? 'default' : 'destructive'}
                      className={`px-2 py-1 text-xs font-medium ${
                        booking.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {booking.status === 'Completed' ? (
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                      ) : (
                        <XCircle className="mr-1 h-3 w-3" />
                      )}
                      {booking.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <dl className="grid gap-3 text-sm">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <dt className="font-medium text-gray-600 mr-2">Tên khách hàng:</dt>
                      <dd className="text-gray-900">{booking.customer?.name || 'N/A'}</dd>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <dt className="font-medium text-gray-600 mr-2">Email:</dt>
                      <dd className="text-gray-900">{booking.customer?.email || 'N/A'}</dd>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <dt className="font-medium text-gray-600 mr-2">Điện thoại:</dt>
                      <dd className="text-gray-900">{booking.customer?.phone || 'N/A'}</dd>
                    </div>
                    <div className="flex items-start">
                      <FileText className="h-4 w-4 mr-2 text-gray-500 mt-1" />
                      <dt className="font-medium text-gray-600 mr-2">Mô tả:</dt>
                      <dd className="text-gray-900">{booking.description}</dd>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <dt className="font-medium text-gray-600 mr-2">Ngày tạo:</dt>
                      <dd className="text-gray-900">{new Date(booking.createAt).toLocaleString('vi-VN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit'
                      })}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      <button onClick={() => navigate(-1)} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded shadow-lg hover:bg-blue-700 transition duration-300">
        Trở về
      </button>
    </div>
  );
}
