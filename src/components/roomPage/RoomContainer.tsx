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
} from "antd";
import { DEVICE_SELECT_OPTONS, DeviceType } from "../../constants/Devices";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { AppDispatch, RootState } from "../../store/store";
import useThreeScene from "../../hooks/useThreeScene.tsx";
import { DayTime } from "../../constants/DayTime.ts";
import { DASHBOARD_PATH } from "../../constants/RoutePaths";
import EditDevice from "./EditDevice.tsx";
<<<<<<< dev
import { addRoom, updateRoom, fetchRooms } from "../../store/user/userSlice";
=======
import { addRoom, updateRoom } from "../../store/user/userSlice";
>>>>>>> main
import useAddRooms from "../../hooks/useAddRooms.tsx";
import type { IRoomDevice } from "../../types/device.ts";



const { Option } = Select;
const { Content, Sider } = Layout;

const RoomContainer = () => {

  const dispatch = useDispatch<AppDispatch>()
  const { roomId } = useParams<{ roomId?: string }>();
  const { handleAddingRoom } = useAddRooms();
  const existingRoom = useSelector((state: RootState) =>
    roomId ? state.user.rooms.find(r => r.id === roomId) : undefined,
  );
  const userId = useSelector((state: RootState) => state.auth.userToken);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
<<<<<<< dev
  const [devices, setDevices] = useState<IRoomDevice[]>(existingRoom?.devices ?? []);
  const [newRoomName, setNewRoomName] = useState(existingRoom?.name ?? "");
  const [newRoomDescription, setNewRoomDescription] = useState(existingRoom?.description ?? "");
=======
  const { roomId } = useParams<{ roomId?: string }>();
  const [devices, setDevices] = useState<IRoomDevice[]>([]);

  const existingRoom = useSelector((state: RootState) => {
    return roomId ? state.user.rooms.find((r) => r.id === roomId) : undefined;
  });
  const initialDevices: IRoomDevice[] = existingRoom
    ? existingRoom.devices
    : [];

  const { threeScene, handleAddDevice } = useThreeScene(initialDevices, handleDeletingDevice);
>>>>>>> main

  useEffect(() => {

    if (userId) {
      dispatch(fetchRooms(userId));
    }

  }, [dispatch, userId, roomId])



  useEffect(() => {
    if (!existingRoom) return;
    setDevices(existingRoom.devices);
    setNewRoomName(existingRoom.name);
    setNewRoomDescription(existingRoom.description);
  }, [existingRoom]);


  const { threeScene, handleAddDevice } = useThreeScene(roomId, devices, handleDeletingDevice);

  const showModal = (type: number) => {
    setSelectedType(type);
    setModalVisible(true);
  };

<<<<<<< dev



=======
>>>>>>> main

  const handleOk = () => {
    form.validateFields().then((values) => {
      // create  IRoomDevice obj
      const newDevice: IRoomDevice = {
        ...values,
        type: selectedType,
        deviceId: Date.now(),
        position: { x: 0, y: 0, z: 0 }
      };
      handleAddDevice(newDevice);
      setDevices(prev => [...prev, newDevice]);
      setModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const onSaveClick = () => {
<<<<<<< dev
    const nameToUse = newRoomName ?? "";
    const descToUse = newRoomDescription ?? "";

=======
    const nameToUse = existingRoom?.name ?? "";
    const descToUse = existingRoom?.description ?? "";
>>>>>>> main
    handleAddingRoom(nameToUse, descToUse, devices);
  };

  function handleDeletingDevice(id: number) {
    setDevices((prev) => {
      return prev.filter((device) => {
        return device.deviceId !== id;
      })
    })
  }

  function saveEditedDevice(id: number, replacementObject: IRoomDevice) {
    setDevices(devices.map((device) => {
      return device.deviceId === id ? { ...device, ...replacementObject } : device
    }))
  }

<<<<<<< dev

=======
>>>>>>> main
  return (
    <Layout style={{ height: "100vh" }}>
      <Content className="kkkkkk" style={{ flex: 1 }}>
        {threeScene}
      </Content>

      <Sider width={400} style={{ background: "#fff", padding: 16 }}>
        <Space direction="vertical" style={{ width: "100%", marginBottom: 24 }}>
          <Form layout="vertical">
            <Form.Item label="Room Name">
              <Input
                placeholder={existingRoom?.name}
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Room Description">
              <Input
                placeholder={existingRoom?.description}
                value={newRoomDescription}
                onChange={(e) => setNewRoomDescription(e.target.value)}
              />
            </Form.Item>

          </Form>
          <Button type="primary" block onClick={onSaveClick}>
            Save Room
          </Button>
          <Button block onClick={() => setDevices([])}>
            Reset Room
          </Button>

          <Button block onClick={() => EditDevice({
            name: "toaster",
            power: 123,
            uptime: 13134,
            workingDayTime: DayTime.Night,
            deviceId: 1,
            type: DeviceType.Dishwasher,
          }, () => { console.log("eler") }, () => handleDeletingDevice(1))}>Edit something</Button>

        </Space>
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

      {/* name: string;
    power: number;
    uptime: number;
    workingDayTime: DayTime; */}

<<<<<<< dev


=======
      <Button onClick={onSaveClick}>Save Room</Button>
      <Button onClick={() => setDevices([])}>Reset Room</Button>
      <Button onClick={() => EditDevice({
        name: "toaster",
        power: 123,
        uptime: 13134,
        workingDayTime: DayTime.Night,
        deviceId: 1,
        type: DeviceType.Dishwasher,
      }, () => { console.log("eler") }, () => handleDeletingDevice(1))}>Edit something</Button>
>>>>>>> main
    </Layout>
  );
};

export default RoomContainer;
