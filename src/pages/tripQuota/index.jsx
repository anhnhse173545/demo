import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './index.scss';

// Sample koiPayments data
const koiPayments = [
  {
    id: 2,
    name: 'Nguyen Hoang Minh',
    farm: 'Matsue Nishikigoi Center',
    time: 'Time Start: 9/19/2024',
    quantity: 2,
    status: 'Pending Quota',
    price: '$400.00',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuK5Sz8ToO0Sz50esp9c-QAu_w71BHtKJLEA&s',
    statusLabel: 'Pending Quota | Waiting',
    email: 'minh@gmail.com',
    phone: '0981918818',
    numberOfPeople: 2,
    startDate: '2024-09-19',
    endDate: '2024-09-25',
    address: '123-123 Ho Chi Minh City',
    koiDescription: 'hihihaha',
    tripdescription: 'hahahii',
    otherrequirements: 'otherrerer',
    salesStaffId: '1', // Link to the sales staff ID
    itinerary: [
      { day: 'Day 1', farm: 'Farm A', koi: ['Koi 1', 'Koi 2'] },
      { day: 'Day 2', farm: 'Farm B', koi: ['Koi 3', 'Koi 4'] },
    ],
  },
];

// Component to display information of a sales staff
const SingleSalesStaffData = ({ salesStaffId }) => {
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Fetching sales staff data...');
    fetch('https://6704ec62031fd46a830de9fb.mockapi.io/api/v1/sales')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Received data:', data);
        const staff = data.find(staff => staff.id === salesStaffId);
        setSalesData(staff || null);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      });
  }, [salesStaffId]);

  if (loading) return <div>Loading sales staff data...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;
  if (!salesData) return <div>No sales staff data available.</div>;

  return (
    <div className="sales-staff-data">
      <h2>Sales Staff Information</h2>
      <div className="staff-data-card">
        <h3>Trip: {salesData.tripDescription}</h3>
        <p><strong>Airport:</strong> {salesData.airport}</p>
        <p><strong>Sales Representative:</strong> {salesData.salesRep}</p>
        <p><strong>Benefits:</strong> {salesData.benefits}</p>
        <p><strong>Terms:</strong> {salesData.terms}</p>
        <p><strong>Additional Info:</strong> {salesData.additionalInfo}</p>
      </div>


      <div className="trip-details">
          <div  className="day-detail">
            <h3>{salesData.day}</h3>
            <p><strong>Farm:</strong> {salesData.farm}</p>
            <p><strong>Koi:</strong> {salesData.koi}</p>
            <p><strong>img:</strong> {salesData.img}</p>

          </div>
        
      </div>
    </div>
  );
};

function QuotaDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const paymentDetails = koiPayments.find((payment) => payment.id === parseInt(id));

  if (!paymentDetails) return <div>Order not found.</div>;

  const handlePay = () => {
    alert('Proceed to Payment');
    navigate('/paykoi');
  };

  const handleReject = () => {
    alert('Quote Rejected');
    navigate('/payment');
  };

  return (
    <div className="quota-details-page">
      <h2>Trip Details for Quotation ID: {paymentDetails.id}</h2>
      <img src={paymentDetails.img} alt={paymentDetails.img} className="koi-image" />
      <div className="customer-sales-container">
        <div className="customer-info">
          <h2>Customer Information</h2>
          <p><strong>Name:</strong> {paymentDetails.name}</p>
          <p><strong>Email:</strong> {paymentDetails.email}</p>
          <p><strong>Phone:</strong> {paymentDetails.phone}</p>
          <p><strong>Koi Description:</strong> {paymentDetails.koiDescription}</p>
          <p><strong>Trip Description:</strong> {paymentDetails.tripdescription}</p>
          <p><strong>Other Requirements:</strong> {paymentDetails.otherrequirements}</p>
          <p><strong>Start Date:</strong> {paymentDetails.startDate}</p>
          <p><strong>End Date:</strong> {paymentDetails.endDate}</p>
        </div>

        <div className="left-side">
          <SingleCustomerStaffData cusId={paymentDetails.cusId} />
        </div>

        <div className="right-side">
          <SingleSalesStaffData salesStaffId={paymentDetails.salesStaffId} />
        </div>
      </div>

      

      <div className="button-group">
        <button className="pay-button" onClick={handlePay}>Pay</button>
        <button className="reject-button" onClick={handleReject}>Reject</button>
      </div>
    </div>
  );
}

const SingleCustomerStaffData = ({ customerId }) => {
  const [cusData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Fetching cus staff data...');
    fetch('https://670857d88e86a8d9e42eb866.mockapi.io/api/v1/trip')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Received data:', data);
        const customer = data.find(customer => customer.id === customerId);
        setCustomerData(customer || null);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      });
  }, [customerId]);

  if (loading) return <div>Loading sales staff data...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;
  if (!cusData) return <div>No customer data available.</div>;

  return (
    <div className="customer-data">
      <h2>Customer Request</h2>
      <div className="customer-data-card">
        <h3>Name: {cusData.Name}</h3>
        <p><strong>Email:</strong> {cusData.Email}</p>
        <p><strong>Phone Representative:</strong> {cusData.Phone}</p>
        <p><strong>Koi Description:</strong> {cusData.KoiDescription}</p>
        <p><strong>Trip Description:</strong> {cusData.TripDescription}</p>
        <p><strong>Other Requirements Info:</strong> {cusData.OtherRequirements}</p>
        <p><strong>Start Date :</strong> {cusData.StartDate}</p>
        <p><strong>ENd Date :</strong> {cusData.EndDate}</p>

      
      </div>
    </div>
  );
};

export default QuotaDetailsPage;

/*
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './index.scss';

// Sample koiPayments data should be defined or imported here
const koiPayments = []; // Replace this with actual data or fetch logic

const SingleSalesStaffData = ({ salesStaffId }) => {
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Fetching sales staff data...');
    fetch('https://6704ec62031fd46a830de9fb.mockapi.io/api/v1/sales')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Received data:', data);
        const staff = data.find(staff => staff.id === salesStaffId);
        setSalesData(staff || null);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      });
  }, [salesStaffId]);

  if (loading) return <div>Loading sales staff data...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;
  if (!salesData) return <div>No sales staff data available.</div>;

  return (
    <div className="sales-staff-data">
      <h2>Sales Staff Information</h2>
      <div className="staff-data-card">
        <h3>Trip: {salesData.tripDescription}</h3>
        <p><strong>Airport:</strong> {salesData.airport}</p>
        <p><strong>Sales Representative:</strong> {salesData.salesRep}</p>
        <p><strong>Benefits:</strong> {salesData.benefits}</p>
        <p><strong>Terms:</strong> {salesData.terms}</p>
        <p><strong>Additional Info:</strong> {salesData.additionalInfo}</p>
      </div>
      <div className="trip-details">
        <div className="day-detail">
          <h3>{salesData.day}</h3>
          <p><strong>Farm:</strong> {salesData.farm}</p>
          <p><strong>Koi:</strong> {salesData.koi}</p>
          <p><strong>Image:</strong> <img src={salesData.img} alt={salesData.koi} /></p>
        </div>
      </div>
    </div>
  );
};

const SingleCustomerData = ({ customerId }) => {
  const [cusData, setCusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Fetching customer data...');
    fetch(`https://6707a1be8e86a8d9e42c3e8e.mockapi.io/api/v1/customerdata/${customerId}`) // Fetch specific customer data
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setCusData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [customerId]);

  if (loading) return <div>Loading customer data...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;
  if (!cusData) return <div>No customer data available.</div>;

  return (
    <div className="customer-data">
      <h2>Customer Request</h2>
      <div className="customer-data-card">
        <h3>Name: {cusData.name}</h3>
        <p><strong>Email:</strong> {cusData.email}</p>
        <p><strong>Phone:</strong> {cusData.phone}</p>
        <p><strong>Koi Description:</strong> {cusData.koiDescription}</p>
        <p><strong>Trip Description:</strong> {cusData.tripDescription}</p>
        <p><strong>Other Requirements:</strong> {cusData.otherRequirements}</p>
        <p><strong>Start Date:</strong> {cusData.startDate}</p>
        <p><strong>End Date:</strong> {cusData.endDate}</p>
      </div>
    </div>
  );
};

function QuotaDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const paymentDetails = koiPayments.find((payment) => payment.id === parseInt(id));

  if (!paymentDetails) return <div>Order not found.</div>;

  const handlePay = () => {
    alert('Proceed to Payment');
    navigate('/paykoi');
  };

  const handleReject = () => {
    alert('Quote Rejected');
    navigate('/payment');
  };

  return (
    <div className="quota-details-page">
      <div className="sales-staff-container">
        <SingleSalesStaffData salesStaffId={paymentDetails.salesStaffId} />
      </div>
      <div className="customer-container">
        <SingleCustomerData customerId={paymentDetails.cusId} />
      </div>
      <div className="button-group">
        <button className="pay-button" onClick={handlePay}>Pay</button>
        <button className="reject-button" onClick={handleReject}>Reject</button>
      </div>
    </div>
  );
}

export default QuotaDetailsPage;


*/