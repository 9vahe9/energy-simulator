import { Button, Typography, Tag, Space, Progress, Modal, Card } from "antd";
import { EditOutlined, ThunderboltFilled } from "@ant-design/icons";
import type { Device } from "../../store/user/userSlice";

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
}: {
  id: string;
  name: string;
  priority: number;
  energy: number;
  cost: number;
  icons: Device[];
  deleteFunction: Function;
  editRoomFunction: Function;
}) => {
  console.log("RoomCards props:", { id, name, priority, energy, cost, icons });

  const confirmModal = (name: string) => {
    Modal.confirm({
      title: "Delete room",
      content: `Are you sure tou want to delete ${name}`,
      okText: "Yes",
      cancelText: "No",
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
      <div className="card-header">
        <Title level={4} style={{ margin: 0 }}>
          {name}
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
          <Text>Energy Consumption</Text>
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

          <Text>Monthly Cost</Text>
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

      {/* Button edit */}
      <Button
        type="primary"
        icon={<EditOutlined />}
        className="ant-btn-edit"
        onClick={() => editRoomFunction(id)}
      >
        Edit Room
      </Button>
      <Button
        onClick={() => {
          confirmModal(name);
        }}
      >
        Delete room
      </Button>
    </Card>
  );
};
