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
  Divider,
} from "antd";
import { DEVICE_SELECT_OPTONS } from "../../constants/Devices";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { AppDispatch, RootState } from "../../store/store";
import useThreeScene from "../../hooks/useThreeScene.tsx";
import { DayTime } from "../../constants/DayTime.ts";

import "./roomCont.css";


import { fetchRooms } from "../../store/user/userSlice";


import useAddRooms from "../../hooks/useAddRooms.tsx";
import type { IRoomDevice } from "../../types/device.ts";

const { Option } = Select;
const { Content, Sider } = Layout;

const RoomContainer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { roomId } = useParams<{ roomId?: string }>();
  const { handleAddingRoom } = useAddRooms();
  const existingRoom = useSelector((state: RootState) =>
    roomId ? state.user.rooms.find((r) => r.id === roomId) : undefined
  );
  const userId = useSelector((state: RootState) => state.auth.userToken);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [devices, setDevices] = useState<IRoomDevice[]>(
    existingRoom?.devices ?? []
  );
  const [newRoomName, setNewRoomName] = useState(existingRoom?.name ?? "");
  const [newRoomDescription, setNewRoomDescription] = useState(
    existingRoom?.description ?? ""
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchRooms(userId));
    }
  }, [dispatch, userId, roomId]);

  useEffect(() => {
    if (!existingRoom) return;
    setDevices(existingRoom.devices);
    setNewRoomName(existingRoom.name);
    setNewRoomDescription(existingRoom.description);
  }, [existingRoom]);

  const handleDeletingDevice = (id: number) => {
    setDevices(prev => {
      const next = prev.filter(d => d.deviceId !== id);
      console.log(devices, "this is a device");
      return next;
    });

  };


const { threeScene, handleAddDevice, getUpdatedDevicesPositions } =
  useThreeScene(handleDeletingDevice, devices); // Pass the current devices state
  const showModal = (type: number) => {
    setSelectedType(type);
    setModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      // create  IRoomDevice obj
      const newDevice: IRoomDevice = {
        ...values,
        type: selectedType,
        deviceId: Date.now(),
        position: { x: 0, y: 0, z: 0 },
      };
      handleAddDevice(newDevice);
      setDevices((prev) => [...prev, newDevice]);
      setModalVisible(false);
      form.resetFields();
    });
  };



  const onSaveClick = () => {
    const nameToUse = newRoomName ?? "";
    const descToUse = newRoomDescription ?? "";


    const updateDevice = getUpdatedDevicesPositions();
    //@ts-ignore
    const matchingItems = getMatchingItems(devices, updateDevice);
    const updatedDevicetArray = devices.map((item) => {
      console.log(item, "item", matchingItems);
      const matchingItem = matchingItems.find(
        (secondItem) =>
          secondItem.name === `device-${item.deviceId}` ||
          secondItem.name === item.name
      );
      if (matchingItem) {
        return {
          ...item,
          position: {
            ...item.position, // keep any existing sub-fields
            ...matchingItem.position, // overwrite x, y, z from the match
          },
        };
      }
      return item;
    });

    console.log(devices, "onSaveClick", updateDevice, updatedDevicetArray);
    handleAddingRoom(nameToUse, descToUse, updatedDevicetArray);
    setDevices(updatedDevicetArray);
  };

  const getMatchingItems = (devices: any[], updateDevice: any[]) => {
    return devices.flatMap((item) => {
      const deviceId = item.deviceId;
      return updateDevice.filter(
        (updateDevice) =>
          updateDevice.name === `device-${deviceId}` ||
          updateDevice.name === item.name
      );
    });
  }



  return (
    <Layout style={{ height: "100vh" }}>
      <Content className="kkkkkk" style={{ flex: 1 }}>
        {threeScene}
      </Content>

      <Sider width={400} style={{ background: "#fff", padding: 16, display: "flex", flexDirection: "column" }}>
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
          <Divider />
          <Button className="save-button" type="primary" block onClick={onSaveClick}>
            Save Room
          </Button>
          <Button block onClick={() => setDevices([])}>
            Reset Room
          </Button>


        </Space>
        <Divider>Devices</Divider>
        <div style={{ overflowY: "auto", maxHeight: "200px", paddingRight: 4 }}>
          <List
            dataSource={DEVICE_SELECT_OPTONS}
            renderItem={(item) => (
              <List.Item style={{ padding: "4px 0" }}>
                <Button
                  className="save-button"
                  type="primary"
                  block
                  onClick={() => showModal(item.type)}
                >
                  {item.icon} {item.label}
                </Button>
              </List.Item>
            )}
          />
        </div>
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

      {/* name: string;
    power: number;
    uptime: number;
    workingDayTime: DayTime; */}

    </Layout>
  );
};


export default RoomContainer;
