// ContentContainer.tsx
import React from "react";
import { Outlet, Link } from "react-router-dom";
import { LanguageSwitcher } from "../components/LanguageSwitcher"
import { Affix, Layout, Menu } from "antd";
import { ABOUT_US, DASHBOARD_PATH, HOME_PATH } from "../constants/RoutePaths";
import "./contentContainer.css"

const { Header, Content } = Layout;

export const ContentContainer: React.FC = () => {

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Affix>
        <Header className="header" style={{ display: "flex", alignItems: "center", padding: "0 24px", border: "0px" }} >
          <div style={{ flex: 1, }}>
            <Menu className="menu" mode="horizontal" selectable={false}>
              <Menu.Item key={"home"}>
                <Link to={HOME_PATH}>Home</Link>
              </Menu.Item>
              <Menu.Item key="dashboard">
                <Link to={DASHBOARD_PATH}>Dashboard</Link>
              </Menu.Item>
              <Menu.Item key="room">
                <Link to={ABOUT_US}>About us</Link>
              </Menu.Item>
            </Menu>
          </div>

          <LanguageSwitcher />
        </Header>
      </Affix>

      <Content style={{ padding: "24px" }}>
        <Outlet />
      </Content>
    </Layout>
  );
};
