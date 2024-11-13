import { Col, Image, Row } from "antd";

const AuthenLayout = ({ children }) => {
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #f0f4f8 0%, #dae0e6 100%)',
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif',
  };

  const imageColStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: '20px',  // More space between image and form
  };

  const imageStyle = {
    borderRadius: '15px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    width: '70%',  // Smaller image
    height: 'auto',
  };

  const contentStyle = {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
    maxWidth: '500px',
    textAlign: 'center',
  };

  const titleStyle = {
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  };

  const subtitleStyle = {
    marginBottom: '20px',
    fontSize: '16px',
    fontWeight: '400',
    color: '#666',
  };

  return (
    <div style={containerStyle}>
      <Row align="middle" gutter={40} style={{ width: '100%' }}>
        <Col xs={24} md={10} style={imageColStyle}>
          <Image
            src="https://cdna.artstation.com/p/assets/images/images/026/978/152/large/marcel-van-tonder-koi-fish-vision-x.jpg?1590253278"
            preview={false}
            style={imageStyle}
          />
        </Col>
        <Col xs={24} md={14}>
          <div style={contentStyle}>
            <h2 style={titleStyle}>Koi Farm</h2>
          
            {children}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AuthenLayout;
