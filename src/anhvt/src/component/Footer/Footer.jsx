import React from "react";
import "./Footer.css"; // Import CSS cho Footer

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Bên trái */}
        <div className="footer-left">
          <p>
            <strong>Address</strong>
          </p>
          <p>
            E2a-7 lot, Saigon High-tech Park, <br /> Long Thanh My Ward, Thu Duc
            City, HCMC
          </p>
        </div>

        {/* Ở giữa */}
        <div className="footer-center">
          <p>Thanks for visting</p>
        </div>

        {/* Bên phải */}
        <div className="footer-right">
          <p>
            <strong>Email</strong>
          </p>
          <p>KoiDeliveryOrderSystem@gmail.com</p>
          <p>
            <strong>Connect with us</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
