import { useNavigate } from "react-router-dom";

const ConsultingStaffHome = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Welcome, Nguyen Van B!</h1>
      <p>We wish you a good working day!</p>

      <button onClick={() => navigate(-1)} className="back-button">Back</button>
    </div>
    
  );
};

export default ConsultingStaffHome;
