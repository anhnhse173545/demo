import { Col, Image, Row } from "antd";

const AuthenLayout = ({ children }) => {
  return (
    <Row align="middle" gutter={30}>
      <Col span={12}>
        <Image src="https://cdna.artstation.com/p/assets/images/images/026/978/152/large/marcel-van-tonder-koi-fish-vision-x.jpg?1590253278" />
      </Col>
      <Col span={12}>{children}</Col>
    </Row>
  );
};

export default AuthenLayout;
