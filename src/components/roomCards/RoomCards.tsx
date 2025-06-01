import { Button, Typography, Tag, Space, Progress, Modal } from 'antd';
import {
    EditOutlined,
    ThunderboltFilled,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const ICON_MAP: Record<string, string> = {
    TV: "📺",
    Lighting: "💡",
    Humidifier: "❄️",
    Magnifier: "🔍",
    Fire: "🔥",
};

const confirmModal = (name) => {
  Modal.confirm({
    title: "Delete room",
    content: `Are you sure tou want to delete ${name}`,
    okText: "Yes",
    cancelText: "No",
    okButtonProps: {
      style: {
        backgroundColor: "#26a69a",
      }
    },
    onOk() {
      console.log(`${name} deleted successfully!`);
    }, 
    onCancel() {
      console.log("Cancel");
    },
  });
};

export const RoomCards = ({ id, name, priority, energy, cost, icons}) => {
    return (
        <div key={id} className="room-card">
          {/* Название и приоритет */}
          <div className="card-header">
            <Title level={4} style={{ margin: 0 }}>
              {name}
            </Title>
            <Tag
              icon={<ThunderboltFilled />}
              className={
                priority === "High"
                  ? "priority-tag-high"
                  : priority === "Medium"
                  ? "priority-tag-medium"
                  : "priority-tag-low"
              }
              color={
                priority === "High"
                  ? "red"
                  : priority === "Medium"
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
              <div
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <Progress
                  percent={Math.round((energy / 500) * 100)}
                  showInfo={false}
                  strokeColor={
                    priority === "High"
                  ? "#C70039"
                  : priority === "Medium"
                  ? "#FFDE2B"
                  : "green"
                  }
                />
                <Text strong>{energy} kWh</Text>
              </div>

              <Text>Monthly Cost</Text>
              <Text strong>${cost.toFixed(2)}</Text>
            </Space>
          </div>

          {/* Icon Device */}
          <div className="device-icons">
            {icons.map((ic) => (
              <Space key={ic.type}>
                <span>{ICON_MAP[ic.type] || "🔌"}</span>
                <Text>{ic.count}</Text>
              </Space>
            ))}
          </div>

          {/* Button edit */}
          <Button
            type="primary"
            icon={<EditOutlined />}
            className="ant-btn-edit"
          >
            Edit Room
          </Button>
          <Button onClick={() => confirmModal(name)}>Delete room</Button>
        </div>
      
      )   
}