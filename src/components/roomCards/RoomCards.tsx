import "./RoomCards.css"
import { Button, Typography, Tag, Space, Progress, Modal, Card, Flex, Divider } from "antd";
import { EditOutlined, ThunderboltFilled, InfoCircleOutlined } from "@ant-design/icons";

  import type { IRoomDevice } from "../../types/device";

  import type { Device } from "../../store/user/userSlice";
  import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

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
  devices,
}: {
  id: string;
  name: string;
  priority: number;
  energy: number;
  cost: number;
  description: string;
  devices: IRoomDevice[];

  icons: IRoomDevice[];
  deleteFunction: Function;
  editRoomFunction: Function;
}) => {

  const [waste, setWaste] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    let tmpWaste = devices.reduce((acc, curr) => {
      const e = curr.power/1000 * curr.uptime/60;
      acc += e;
      return acc;
    }, 0);

    setWaste(Number(tmpWaste.toFixed(2)));
  }, [energy]);

  console.log("waste -> ", waste);
  console.log("RoomCards props:", { id, name, priority, energy, cost, icons, description, devices });

  const descriptionModal = () => {
    Modal.info({
      title: t("dashboard.Modal.description"),
      content: description.trim() || t("roomCards.description"),
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
      <div className="main-part" style={{ flexGrow: 1 }}>
        <div className="card-header">
          <Title level={4} onClick={descriptionModal} style={{ margin: 0, cursor: "pointer" }}>
            {name} <InfoCircleOutlined style={{ marginLeft: 8, color: "#26a69a" }} />
          </Title>
          <Tag
            icon={<ThunderboltFilled />}
            className={
              waste >= 5
                ? "priority-tag-high"
                : waste >= 2 && waste < 5
                ? "priority-tag-medium"
                : "priority-tag-low"
            }
            color={
              waste >= 5
                ? "red"
                : waste >= 2 && waste < 5
                ? "yellow"
                : "green"
            }
          >
            {waste >= 5 ? "High" : waste >= 2 ? "Medium" : "Low"}
          </Tag>
        </div>

        {/* Статистика */}
        <div className="card-stats">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text>{t("roomCards.energy")}</Text>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Progress
                percent={Math.round((Number(waste) / 8) * 100)}
                showInfo={false}
                strokeColor={
                  waste >= 5 ? "#C70039" : waste >= 2 ? "#FFDE2B" : "green"
                }
                style={{ width: "72%" }}
              />
              <Text strong>{waste}kWh</Text>
            </div>
            <Flex justify="space-between">
              <Text>{t("roomCards.cost")}</Text>
              <Text strong>${cost.toFixed(2)}</Text>
            </Flex>
          </Space>
        </div>

        {/* Иконки */}
        <div className="device-icons">
          {icons.length > 0 ? icons.map((ic) => (
            <Space key={ic.name}>
              <span>{ICON_MAP[ic.name] || "🔌"}</span>
            </Space>
          )) : <br />}
        </div>
      </div>

      <Divider />

      <Flex align="center" justify="center" className="card-buttons" style={{ gap: "0.5rem" }}>
        <Button
          type="primary"
          icon={<EditOutlined />}
          className="ant-btn-edit"
          onClick={() => editRoomFunction(id)}
        >
          {t("roomCards.edit")}
        </Button>
        <Button onClick={() => confirmModal(name)}>
          {t("roomCards.delete")}
        </Button>
      </Flex>
    </Card>
  );
};
