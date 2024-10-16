import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  UnorderedListOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Layout, Menu } from "antd";
import { Link, Route, Routes } from "react-router-dom";
import SaleStaffHome from "./SaleStaffHome"; // Assuming this component exists
import CustomerRequest from "./CustomerRequest"; // Assuming this component is where you handle customer requests
import CreateTripPlan from "./CreateTripPlan";
import ViewTripPlan from "./ViewTripPlan";
const { Header, Sider, Content } = Layout;

const SaleStaff = () => {
  const [collapsed, setCollapsed] = useState(false);
  const saleStaffName = "John Doe"; // Replace this with dynamic data from your app context

  return (
    <Layout>
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
              {saleStaffName}
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
              label: <Link to="/SaleStaffHome">Home</Link>, // Link for Sale Staff Home
            },
            {
              key: "2",
              icon: <UnorderedListOutlined />,
              label: <Link to="/CustomerRequest">Customer Request</Link>, // Link for Customer Request
            },
            {
              key: "3",
              icon: <LogoutOutlined />,
              label: "Log Out",
              style: { marginTop: "auto" }, // Push Log Out button to the bottom
              onClick: () => {
                // Add the actual log out logic here
                message.success("Logged out successfully");
              },
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#fff",
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
            background: "#fff",
            borderRadius: "8px",
          }}
        >
          <Routes>
            {/* Define routes for Sale Staff pages */}
            <Route path="/SaleStaffHome" element={<SaleStaffHome />} />
            <Route path="/CustomerRequest" element={<CustomerRequest />} />
            <Route path="/create-trip-plan" element={<CreateTripPlan />} />
            <Route path="/view-trip-plan" element={<ViewTripPlan />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default SaleStaff;
