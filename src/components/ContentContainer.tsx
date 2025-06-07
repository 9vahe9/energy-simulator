// ContentContainer.tsx
import React from "react";
import { Outlet, Link } from "react-router-dom";
import { LanguageSwitcher } from "../components/LanguageSwitcher"; // ваш компонент переключения
import { Layout, Menu, Typography } from "antd";

const { Header, Content } = Layout;

export const ContentContainer: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Шапка с меню и языковым свитчером */}
      <Header style={{ display: "flex", alignItems: "center", padding: "0 24px" }}>
        {/* Пример простого меню; при необходимости добавьте иконки, стили */}
        <div style={{ flex: 1 }}>
          <Menu theme="dark" mode="horizontal" selectable={false}>
            <Menu.Item key="home">
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="dashboard">
              <Link to="/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="room">
              <Link to="/room">Rooms</Link>
            </Menu.Item>
          </Menu>
        </div>

        {/* LanguageSwitcher появится справа */}
        <LanguageSwitcher />
      </Header>

      {/* Контейнер для динамического контента (HomePage, DashboardPage, RoomPage) */}
      <Content style={{ padding: "24px" }}>
        <Outlet />
      </Content>
    </Layout>
  );
};
