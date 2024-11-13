import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  UnorderedListOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Layout, Menu, theme } from "antd";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import DeliveryStaffHome from "./DeliveryStaffHome";
import DeliveryOrderList from "./DeliveryOrderList";
import TrackingOrder from "./TrackingOrder";

const { Header, Sider, Content } = Layout;

const DeliveryStaff = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const userName = "John Doe"; // Replace with actual user name from your app state or context
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement logout functionality here
    console.log("Logout clicked");
    // For example, you might want to navigate to a login page:
    // navigate('/login');
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            flexDirection: "column",
          }}
        >
          <Avatar size={64} icon={<UserOutlined />} />
          {!collapsed && (
            <span style={{ color: "white", marginTop: "10px" }}>
              {userName}
            </span>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <HomeOutlined />,
              label: <Link to="/">Home</Link>,
            },
            {
              key: "2",
              icon: <UnorderedListOutlined />,
              label: <Link to="/DeliveryOrderList">Order List</Link>,
            },
            {
              key: "3",
              icon: <LogoutOutlined />,
              label: "Log Out",
              onClick: handleLogout,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Routes>
            <Route
              path="/"
              element={<DeliveryStaffHome userName={userName} />}
            />
            <Route path="/DeliveryOrderList" element={<DeliveryOrderList />} />
            <Route path="/TrackingOrder/:orderId" element={<TrackingOrder />} />
            <></>
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DeliveryStaff;
