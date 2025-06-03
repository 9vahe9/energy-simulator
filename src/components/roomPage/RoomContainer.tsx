import {
  Layout,
  List,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
} from "antd";
import { DEVICE_SELECT_OPTONS } from "../../constants/Devices";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { AppDispatch, RootState } from "../../store/store";
import useThreeScene from "../../hooks/useThreeScene.tsx";
import { DayTime } from "../../constants/DayTime.ts";
import { DASHBOARD_PATH } from "../../constants/RoutePaths";
import {
  addRoom,
  type Device,

  updateRoom,
} from "../../store/user/userSlice";
const { Content, Sider } = Layout;
const { Option } = Select;
const RoomContainer = () => {
  const { threeScene, handleAddDevice } = useThreeScene();

  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { roomId } = useParams<{ roomId?: string }>();
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [devices, setDevices] = useState<Device[]>([]);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const userId: string = useSelector(
    (state: RootState) => state.auth.userToken
  );

  const existingRoom = useSelector((state: RootState) => {
    return roomId ? state.user.rooms.find((r) => r.id === roomId) : undefined;
  });

  useEffect(() => {
    if (existingRoom) {
      setRoomName(existingRoom.name);
      setDescription(existingRoom.description);
      setDevices(existingRoom.devices);
    }
  }, [existingRoom]);
  const showModal = (type: number) => {
    setSelectedType(type);
    setModalVisible(true);
  };


  const handleOk = () => {
    form.validateFields().then((values) => {
      // create  IRoomDevice obj
      const device = {
        type: selectedType!,
        name: values.name,
        power: values.power,
        uptime: values.uptime,
        workingDayTime: values.workingDayTime,
      };
      handleAddDevice(device);
      setModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  function handleDeletingDevice(id: string) {
    setDevices(devices.filter((device) => device.deviceId !== id));
  }

  function handleAddingDevice(device: Device) {
    setDevices([...devices, device]);
  }

  return (
    <Layout style={{ height: "100vh" }}>
      <Content className="kkkkkk" style={{ flex: 1 }}>
        {threeScene}
      </Content>
      <Sider width={400} style={{ background: "#fff", padding: 16 }}>
        <h3>Devices</h3>
        <List
          dataSource={DEVICE_SELECT_OPTONS}
          renderItem={(item) => (
            <List.Item>
              <Button type="primary" onClick={() => showModal(item.type)}>
                {item.icon} {item.label}
              </Button>
            </List.Item>
          )}
        />
      </Sider>

      <Modal
        title="add device"
        open={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Add"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ workingDayTime: DayTime.Day }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please enter device name" },
              { min: 3, message: "min 3 charachter" },
            ]}
          >
            <Input minLength={3} maxLength={15} />
          </Form.Item>

          <Form.Item
            name="power"
            label="Power"
            rules={[{ required: true, message: "Please enter device power" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="uptime"
            label="Uptime (minute)"
            rules={[{ required: true, message: "please enter uptime " }]}
          >
            <InputNumber min={0} max={1440} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="workingDayTime"
            label="Working on Day"
            rules={[{ required: true, message: "please choose time on day" }]}
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
