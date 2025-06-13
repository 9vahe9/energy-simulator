import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Dropdown } from "antd";
import { GlobalOutlined } from "@ant-design/icons";

const items = [
  {
    key: "en",
    label: "English",
  },
  {
    key: "ru",
    label: "Русский",
  },
  {
    key: "am",
    label: "Հայերեն",
  },
];

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleSwitch = (e: any) => {
    i18n.changeLanguage(e.key);
  };

  return (
    <Dropdown
      menu={{items, onClick: handleSwitch}}
      placement="bottomRight"
      arrow
    >
      <Button icon={<GlobalOutlined />} />
    </Dropdown>
  );
};