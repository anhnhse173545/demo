import { useNavigate } from "react-router-dom";
import "./index.scss";
import { UserOutlined } from '@ant-design/icons';
function Header() {

    const navigate = useNavigate();

  return (
    <div className="header">
        <div className="header__left">
        <img onClick={() => navigate("/")} src="https://gudlogo.com/wp-content/uploads/2019/05/logo-ca-Koi-37.png" alt="logo"
         className="header__logo" 
         width={100}
         />
         <ul className="header__navigation">
            <li  onClick={() => navigate("/")}>Home</li>
            <li onClick={() => navigate("/payment")}>My Booking</li>
            <li onClick={() => navigate("/contact")}>Request</li>
            <li>Koi Farm</li>
         </ul>
        </div>
         {/* space */}
        <div className="header__right">
            <div className="header__cart">
                <span className="number"></span>
            </div>
            <div className="header__account">
            <UserOutlined size={50} className="icon" onClick={()=>navigate("/login")}
                />
            </div>
        </div>
    </div>
    
  )
}

export default Header;