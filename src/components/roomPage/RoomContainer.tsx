import {
  Layout,
  List,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import useThreeScene from "../../hooks/useThreeScene";
import { DEVICE_SELECT_OPTONS } from "../../constants/Devices";
import { DayTime } from "../../constants/DayTime";
import "./roomContainer.css";

/* --------------- */

const { Content, Sider } = Layout;
const { Option } = Select;

const RoomContainer = () => {
  /* === выбор комнаты === */
  const [selectedRoom, setSelectedRoom] = useState("emptyroom.glb");
  const [customRoom, setCustomRoom] = useState<string | null>(null);

  const {
    threeScene,
    handleAddDevice,
    // rotateModelLeft,
    // rotateModelRight,
    // rotateModelXPos,
    // rotateModelXNeg,
    // rotateModelZPos,
    // rotateModelZNeg,
    resetModelRotation,
  } = useThreeScene(customRoom || selectedRoom);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [form] = Form.useForm();

  const showModal = (type: number) => {
    setSelectedType(type);
    setModalVisible(true);
  };
  const handleOk = () => {
    form.validateFields().then((v) => {
      handleAddDevice({
        type: selectedType!,
        name: v.name,
        power: v.power,
        uptime: v.uptime,
        workingDayTime: v.workingDayTime,
      });
      setModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Content style={{ flex: 1 }}>{threeScene}</Content>

      <Sider width={380} style={{ background: "#fff", padding: 16 }}>
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Select
            value={customRoom ? "custom" : selectedRoom}
            onChange={(v) => {
              setCustomRoom(null);
              setSelectedRoom(v);
            }}
            style={{ width: "100%" }}
          >
            <Option value="emptyroom.glb">🟦 Empty room</Option>
          </Select>

          {/* <div className="rotation-buttons">
            <Button onClick={rotateModelLeft}>↺</Button>
            <Button onClick={rotateModelRight}>↻</Button>
            <Button onClick={rotateModelXPos}>X+</Button>
            <Button onClick={rotateModelXNeg}>X-</Button>
            <Button onClick={rotateModelZPos}>Z+</Button>
            <Button onClick={rotateModelZNeg}>Z-</Button>
            <Button onClick={resetModelRotation}>Reset</Button>
          </div> */}

          {/* список устройств */}
          <List
            grid={{ gutter: 8, column: 3 }}
            dataSource={DEVICE_SELECT_OPTONS}
            renderItem={(item) => (
              <List.Item>
                <Button
                  type="primary"
                  block
                  onClick={() => showModal(item.type)}
                >
                  {item.icon} {item.label}
                </Button>
              </List.Item>
            )}
          />
        </Space>
      </Sider>

      {/* модалка добавления устройства */}
      <Modal
        title="Add device"
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ workingDayTime: DayTime.Day }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true }, { min: 3 }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="power"
            label="Power (W)"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="uptime"
            label="Uptime (min)"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} max={1440} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="workingDayTime"
            label="Working time"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value={DayTime.Day}>Day</Option>
              <Option value={DayTime.Night}>Night</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default RoomContainer;
