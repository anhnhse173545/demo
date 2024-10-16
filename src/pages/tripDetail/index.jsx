import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import "./index.scss";

function PaymentDetailsPage() {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate();
  
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch payment details from API
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await fetch(`https://670857d88e86a8d9e42eb866.mockapi.io/api/v1/trip/${id}`); // Replace with your API URL
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
  }, [id]); // Dependency array ensures this runs when `id` changes

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // If paymentDetails is still null (though it shouldn't be if fetching is successful)
  if (!paymentDetails) {
    return <div>Order not found</div>;
  }

  return (
    <div className="payment-details-page">
      <h2>Payment Details for Order ID: {paymentDetails.id}</h2>
      <div className="details-container">
        <img src={paymentDetails.img} alt={paymentDetails.name} className="payment-image" />
        <p><strong>Name:</strong> {paymentDetails.name}</p>
        <p><strong>Email:</strong> {paymentDetails.email}</p>
        <p><strong>Phone:</strong> {paymentDetails.phone}</p>
        <p><strong>Koi Description:</strong> {paymentDetails.koidescription}</p>
        <p><strong>Trip Description:</strong> {paymentDetails.tripdescription}</p>
        <p><strong>Other Requirements:</strong> {paymentDetails.otherrequiremenets}</p>
        <p><strong>Start Date:</strong> {paymentDetails.startdate}</p>
        <p><strong>End Date:</strong> {paymentDetails.enddate}</p>
        <p><strong>Status:</strong> {paymentDetails.status}</p>
        
      </div>
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}

export default PaymentDetailsPage;
