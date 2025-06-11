import "./RoomCards.css"
import { Button, Typography, Tag, Space, Progress, Modal, Card, Flex } from "antd";
import { EditOutlined, ThunderboltFilled, InfoCircleOutlined } from "@ant-design/icons";

import type { IRoomDevice } from "../../types/device";

import type { Device } from "../../store/user/userSlice";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const ICON_MAP: Record<string, string> = {
  TV: "📺",
  Lighting: "💡",
  Humidifier: "❄️",
  Magnifier: "🔍",
  Fire: "🔥",
};

export const RoomCards = ({
  id,
  name,
  priority,
  energy,
  cost,
  icons,
  deleteFunction,
  editRoomFunction,
  description,
}: {
  id: string;
  name: string;
  priority: number;
  energy: number;
  cost: number;
  description: string;

  icons: IRoomDevice[];
  deleteFunction: Function;
  editRoomFunction: Function;
}) => {


  const { t } = useTranslation();

  console.log("RoomCards props:", { id, name, priority, energy, cost, icons, description });

  const descriptionModal = () => {
    Modal.info({
      title: t("dashboard.Modal.description"),
      content: description || t("roomCards.description"),
      okText: "Ok",

      okButtonProps: {
        style: {
          backgroundColor: "#26a69a",
        },
      },
    });
  }

  const confirmModal = (name: string) => {
    Modal.confirm({

      title: t("roomCards.Modal.title"),
      content: t("roomCards.Modal.content", {name}),
      okText: t("roomCards.Modal.ok"),
      cancelText: t("roomCards.Modal.cancel"),

      okButtonProps: {
        style: {
          backgroundColor: "#26a69a",
        },
      },
      onOk() {
        deleteFunction(id);
        console.log(`${name} deleted successfully!`);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <Card key={id} className="room-card">
      {/* Название и приоритет */}
      <div> 
      <div className="main-part">
        <div className="card-header">
          <Title level={4} onClick={descriptionModal} style={{ margin: 0, cursor: "pointer" }}>
            {name} <InfoCircleOutlined style={{ marginLeft: 8, color: "#26a69a" }} />
          </Title>
          <Tag
            icon={<ThunderboltFilled />}
            className={
              priority >= 1000
                ? "priority-tag-high"
                : priority >= 500 && priority < 1000
                ? "priority-tag-medium"
                : "priority-tag-low"
            }
            color={
              priority >= 1000
                ? "red"
                : priority >= 500 && priority < 1000
                ? "yellow"
                : "green"
            }
          >
            {priority}
          </Tag>
        </div>

        {/* Card body */}
        <div className="card-body"></div>

        {/* Statics */}
        <div className="card-stats">
          <Space direction="vertical" style={{ width: "100%" }}>

            <Text>{t("roomCards.energy")}</Text>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Progress
                percent={Math.round((Number(energy) / 1000) * 100)}
                showInfo={false}
                strokeColor={
                  priority >= 1000
                    ? "#C70039"
                    : priority >= 500 && priority < 1000
                    ? "#FFDE2B"
                    : "green"
                }
              />
              <Text strong>{energy} kWh</Text>
            </div>

            <Text>{t("roomCards.cost")}</Text>

            <Text strong>${cost}</Text>
          </Space>
        </div>
      

        {/* Icon Device */}
        <div className="device-icons">
          {icons.map((ic) => (
            <Space key={ic.name}>
              <span>{ICON_MAP[ic.name] || "🔌"}</span>
            </Space>
          ))}
        </div>
      </div>

      {/* Button edit */}
      <Flex align="center" justify="center" className="card-buttons">
        <Button
          type="primary"
          icon={<EditOutlined />}
          className="ant-btn-edit"
          onClick={() => editRoomFunction(id)}
        >

          {t("roomCards.edit")}

        </Button>
        <Button
          onClick={() => {
            confirmModal(name);
          }}
        >
          {t("roomCards.delete")}
        </Button>
      </Flex>
      </div>
    </Card>
  );
};
