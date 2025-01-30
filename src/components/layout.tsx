/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  UsergroupAddOutlined,
  FileTextOutlined,
  FileProtectOutlined
} from '@ant-design/icons';
import translations from 'src/localization';
import { Button, Layout, Menu, Dropdown, Avatar, Space, Select } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import logobig from "@assets/images/logos/logo.jpg";
import logosmall from "@assets/images/logos/logo.jpg";

const { Header, Sider, Content } = Layout;

function getItem(label: string, key: string, icon?: any, children?: any) {
  return {
    key,
    icon,
    children,
    label,
  };
}

type LayoutProps = {
  children: React.ReactNode;
};

// Localization data


export const LayoutComponent = ({ children }: LayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [language, setLanguage] = useState<any>(localStorage.getItem("language") || "uz");
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const translate = (key: string) => translations[language]?.[key] || key;

  const sidebarItems = [
    { name: "clients", path: "/clients", icon: <UsergroupAddOutlined />, accessRoles: ["store_admin"] },
    { name: "contracts", path: "/contracts", icon: <FileTextOutlined />, accessRoles: ["store_admin"] },
    { name: "genesisContracts", path: "/genesis-contracts", icon: <FileProtectOutlined />, accessRoles: ["store_admin"] },
    { name: "notifications", path: "/notifications", icon: <BellOutlined />, accessRoles: ["store_admin"] },
  ];

  const role = "store_admin";

  const itemsTop = sidebarItems
    .filter(item => item.accessRoles.includes(role))
    .map(item =>
      getItem(
        translate(item.name),
        item.path,
        item.icon
      )
    );

  const userData = localStorage.getItem('userData');
  const token = localStorage.getItem('authToken');
  const parsedData = JSON.parse(localStorage.getItem("userData") || "{}");

  useEffect(() => {
    if (token) {
      navigate(pathname);
    } else {
      navigate("/login");
    }
  }, [token, userData]);

  const handleMenuClick = ({ key }: any) => {
    if (key === "logout") {
      localStorage.removeItem('userData');
      localStorage.removeItem('authToken');
      navigate("/login");
    } else if (key === "userInfo") {
      navigate("/profile");
    }
  };

  const items = [
    { key: "userInfo", icon: <UserOutlined />, label: translate("profile") },
    { key: "logout", icon: <LogoutOutlined />, label: translate("logout") },
  ];

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    localStorage.setItem("language", value);
    navigate(location.pathname);
  };


  
  return (
    <Layout className="main-layout">
      <Sider width={220} trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical">
          <span className="logo2">
            <img src={logobig} alt="logo" width={40} height={40} />
          </span>
          <span className="logo1">
            <img src={logosmall} alt="logo" width={40} height={40} />
          </span>
        </div>
        <Menu  defaultSelectedKeys={[pathname]} mode="inline" items={itemsTop} onClick={({ key }) => navigate(key)} />
      </Sider>
      <Layout>
        <Header className="header" style={{ padding: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", width: 64, height: 64 }}
          />
       <Space style={{ display: "flex", alignItems: "center", justifyContent: "center", gap:"40px" }}>
       <Select
          
          value={language}
          onChange={handleLanguageChange}
          style={{color:"#000000",  width:70, textAlign:"center"}}
        >
          <Select.Option value="uz">UZ</Select.Option>
          <Select.Option value="ru">RU</Select.Option>
        </Select>
        <Dropdown
        className='dropdown-profile'
          menu={{ items, onClick: handleMenuClick }}
          trigger={['click']}
        >
          <Space style={{ marginRight: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Avatar style={{ backgroundColor: "#ccc" }} size="default" icon={<UserOutlined />} />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: "1.5" }}>
              <b>{parsedData?.name}</b>
              <p style={{ color: "#ccc" }}>{parsedData?.role}</p>
            </div>
          </Space>
        </Dropdown>
       </Space>
        </Header>
        <Content
          className="main-layout"
          style={{
            margin: "24px 16px",
            background: "#f0f2f5",
            borderRadius: "10px",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
