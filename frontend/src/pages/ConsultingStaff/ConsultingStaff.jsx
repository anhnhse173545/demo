import { useState, useEffect } from "react";
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
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const ConsultingStaff = () => {
  const [userName, setUserName] = useState("Loading...");
  const { userId } = useParams(); // Capture userId from URL

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/accounts/${userId}/detail`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setUserName(data.name);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        setUserName("Error fetching name");
      }
    };
    if (userId) fetchUserName();
  }, [userId]);

  const handleLogout = () => {
    navigate("/login"); // Redirect to the login page
  };
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
              {userName} {/* Render the fetched user name here */}
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
              label: <Link to="/cs-dashboard">Home</Link>,
            },
            {
              key: "2",
              icon: <UnorderedListOutlined />,
              label: <Link to="/cs-dashboard/tour-list">Tour List</Link>,
            },
            {
              key: "3",
              icon: <PlusOutlined />,
              label: <Link to="/cs-dashboard/order-list">Order List</Link>,
            },
            {
              key: "4",
              icon: <LogoutOutlined />,
              label: "Log Out",
              style: { marginTop: "auto" },
              onClick: handleLogout, // Attach the handleLogout function
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
          <Outlet /> {/* Render nested routes here */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ConsultingStaff;
