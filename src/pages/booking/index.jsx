import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './index.scss'; // Import CSS file for styling

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [payments, setPayments] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch('https://670857d88e86a8d9e42eb866.mockapi.io/api/v1/trip'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch payments');
        }
        const data = await response.json();
        setPayments(data); // Set the fetched payments data
      } catch (error) {
        setError(error.message); // Handle any errors
      } finally {
        setLoading(false); // Set loading to false when finished
      }
    };

    fetchPayments();
  }, []);

  // Filter payments based on selected status
  const filteredPayments = payments.filter((payment) =>
    selectedStatus === 'All' ? true : payment.status === selectedStatus
  );

  return (
    <div className="payment-page-container">
      {/* Sidebar */}
      <div className="profile-sidebar">
        <ul>
          <li>
            <Link to="/profile" className={`sidebar-link ${location.pathname === '/profile' ? 'active' : ''}`}>
              My Profile
            </Link>
          </li>
          <li>
            <Link to="/payment" className={`sidebar-link ${location.pathname === '/payment' ? 'active' : ''}`}>
              My Trip
            </Link>
          </li>
          <li>
            <Link to="/mykoi" className={`sidebar-link ${location.pathname === '/mykoi' ? 'active' : ''}`}>
              My Koi Fish
            </Link>
          </li>
        </ul>
      </div>

      {/* Status Tabs */}
      <div className="payment-section">
        <div className="status-tabs">
          {['All', 'Request', 'Pending Quota', 'On going', 'Completed', 'Canceled'].map((status) => (
            <button
              key={status}
              className={`tab ${selectedStatus === status ? 'active' : ''}`}
              onClick={() => setSelectedStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Payment List */}
        <div className="payment-list">
          {loading && <p>Loading...</p>} {/* Show loading state */}
          {error && <p className="error">{error}</p>} {/* Show error state */}
          {!loading && !error && filteredPayments.length === 0 && <p>No payments found.</p>} {/* No payments message */}
          {filteredPayments.map((koi) => (
            <div key={koi.id} className="payment-item">
              <img src={koi.img} alt={koi.farm} className="koi-image" />
              <div className="payment-details">
                <h3>{koi.farm}</h3>
                <p>{koi.time}</p>
                {koi.quantity && <p>Quantity: {koi.quantity}</p>}
                <p className="status">{koi.statusLabel}</p>
                <p className="price">{koi.price}</p>

                <div className="button-group">
                  <button
                    className="details-button"
                    onClick={() => {
                      if (koi.status === 'Pending Quota') {
                        navigate(`/quota/${koi.id}`);
                      } else if (koi.status === 'Request') {
                        navigate(`/payment/${koi.id}`);
                      } else if (koi.status === 'On going') {
                        navigate(`/ongoing/${koi.id}`);
                      } else {
                        navigate(`/payment/${koi.id}`);
                      }
                    }}
                  >
                    See Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
