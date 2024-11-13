import { useState, useEffect } from 'react';
import './index.scss'; // Import file CSS để styling
import { Link, useNavigate, useLocation } from 'react-router-dom';

function KoiPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [koiPayments, setKoiPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Lấy customerId từ URL

  // Gọi API để lấy dữ liệu koi payments
  useEffect(() => {
    const fetchKoiPayments = async () => {
      try {
        const response = await fetch(`http://localhost:8080/fish-order/customer/${id}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setKoiPayments(data);
        } else {
          throw new Error('Invalid data structure');
        }
      } catch (err) {
        setError('Failed to fetch koi payments');
      } finally {
        setLoading(false);
      }
    };

    fetchKoiPayments();
  }, []);

  // Lọc các đơn hàng dựa theo trạng thái được chọn
  const filteredPayments = koiPayments.filter((koi) => {
    if (selectedStatus === 'All') return true;
    if (selectedStatus === 'Deposited' || selectedStatus === 'Paid Full') {
      return koi.paymentStatus === selectedStatus;
    }
    return koi.status === selectedStatus;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="payment-page-container">
      {/* Sidebar */}
      <div className="profile-sidebar">
        <ul>
          <li>
            <Link to={`/userDetail/${id}`} className={`sidebar-link ${location.pathname === '/userDetail' ? 'active' : ''}`}>
              My Profile
            </Link>
          </li>
          <li>
            <Link to={`/payment/${id}`} className={`sidebar-link ${location.pathname === '/payment' ? 'active' : ''}`}>
              My Trip
            </Link>
          </li>
          <li>
            <Link to={`/mykoi/${id}`} className={`sidebar-link ${location.pathname === '/mykoi' ? 'active' : ''}`}>
              My Koi
            </Link>
          </li>

          <li>
            <Link to={`/history/${id}`} className={`sidebar-link ${location.pathname === `/history` ? 'active' : ''}`}>
              Order history
            </Link>
          </li>
        </ul>
      </div>

      {/* Phần hiển thị thanh tabs để lọc */}
      <div className="payment-section">
        <div className="status-tabs">
          {['All', 'Pending', 'Deposited', 'In Transit', 'Delivering', 'Paid Full', 'Canceled'].map((status) => (
            <button
              key={status}
              className={`tab ${selectedStatus === status ? 'active' : ''}`}
              style={{ color: 'black' }} // Thêm style inline
              onClick={() => setSelectedStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Phần hiển thị danh sách các payments dựa trên bộ lọc */}
        <div className="payment-list">
          {filteredPayments.map((koi) => (
            <div key={koi.id} className="payment-item">
              <img
                src={koi.img}
                alt={koi.koi}
                className="koi-image"
              />
              <div className="payment-details">
                <h3>{koi.name}</h3>
                <p>{koi.koi}</p>
                {koi.quantity && <p>Quantity: {koi.quantity}</p>}
                {koi.size && <p>Size: {koi.size} cm</p>}
                <p className="Id Trip">Koi ID: {koi.id}</p>
                <p className="Id Farm">Farm ID: {koi.farmId}</p>
                <p className="Id Farm">Status: {koi.status}</p>
                <p className="Id Farm">Payment Status: {koi.paymentStatus}</p>

             

                <button
                  className="details-button"
                  onClick={() => navigate(`/mykoi/${koi.id}`)}
                >
                  See Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default KoiPage;
