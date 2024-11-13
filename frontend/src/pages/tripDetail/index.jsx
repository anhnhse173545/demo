import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, User, Mail, Phone, FileText, Calendar, Tag } from 'lucide-react';

export default function PaymentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/booking/get/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch payment details');
        }
        const data = await response.json();
        setPaymentDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!paymentDetails) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-gray-700">Order not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-4xl">
        <div className="bg-blue-600 text-white p-6">
          <h2 className="text-3xl font-bold">Payment Details</h2>
          <p className="text-blue-200">Order ID: {paymentDetails.id}</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-semibold">{paymentDetails.customer.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{paymentDetails.customer.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-semibold">{paymentDetails.customer.phone}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FileText className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="font-semibold">{paymentDetails.description || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="font-semibold">{new Date(paymentDetails.createAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Tag className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-semibold">{paymentDetails.status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back
          </button>
        </div>
      </div>
    </div>
  );
}