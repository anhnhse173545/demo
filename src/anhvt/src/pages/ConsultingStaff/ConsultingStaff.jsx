import { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Layout, Menu, theme } from "antd";
import { Link, Route, Routes } from "react-router-dom"; // Import routing components
import ConsultingStaffHome from "./ConsultingStaffHome";
import TourList from "./TourList";
import TourDetails from "./TourDetails"; // Import the new TourDetails component
import KoiDetails from "./KoiDetails";
import OrderList from "./OrderList";
import AddKoi from "./AddKoi";

const { Header, Sider, Content } = Layout;

const ConsultingStaff = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const userName = "John Doe"; // Replace with the actual user's name from your app state or context

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
              label: <Link to="/">Home</Link>, // Link for Home
            },
            {
              key: "2",
              icon: <UnorderedListOutlined />,
              label: <Link to="/TourList">Tour List</Link>, // Link for List Tour
            },
            {
              key: "3",
              icon: <PlusOutlined />,
              label: <Link to="/OrderList">Order List</Link>, // Link for Add New Order
            },
            {
              key: "4",
              icon: <LogoutOutlined />,
              label: "Log Out",
              style: { marginTop: "auto" },
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
            {/* Define routes for each page */}
            <Route
              path="/"
              element={<ConsultingStaffHome userName={userName} />}
            />
            <Route path="/TourList" element={<TourList />} />
            <Route path="/OrderList" element={<OrderList />} />
            <Route path="/koi-details" element={<KoiDetails />} />
            <Route path="/add-koi" element={<AddKoi />} />
            <Route
              path="/tour-details/:tourId"
              element={<TourDetails />}
            />{" "}
            {/* New Route for Tour Details */}
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ConsultingStaff;
