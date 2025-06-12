import React from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Outlet } from "react-router-dom";

export const AppLayout: React.FC = () => {
  return (
    <div style={{ margin: "0 auto", padding: "40px 16px" }}>
      <div style={{ textAlign: "right", marginBottom: "24px" }}>
        <LanguageSwitcher />
      </div>
      <Outlet />
    </div>
  );
};