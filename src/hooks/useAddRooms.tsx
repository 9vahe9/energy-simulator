import {
  Select,
  Button,
  Layout,
  List,
  Modal,
  Form,
  Input,
  InputNumber,
} from "antd";
import { DEVICE_SELECT_OPTONS } from "../constants/Devices";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { AppDispatch, RootState } from "../store/store";
import { DASHBOARD_PATH, ROOM_PATH } from "../constants/RoutePaths";
import {
  addRoom,
  type Device,
  type Room,
  updateRoom,
} from "../store/user/userSlice";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { DayTime } from "../constants/DayTime.ts";
//const { Content } = Layout;
const { Option } = Select;
const useAddRooms = () => {
  const { roomId } = useParams<{ roomId?: string }>();
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [devices, setDevices] = useState<Device[]>([]);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const userId: string = useSelector(
    (state: RootState) => state.auth.userToken
  );

  const randomId = (() => {
    const now = new Date();
    return [
      now.getDate(),
      now.getMonth() + 1,
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
    ]
      .map((n) => String(n).padStart(2, "0"))
      .join("_");
  })();

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

  const room: Room = {
    name: roomName,
    description: description,
    levelOfEnergyConsumption: "15w",
    monthlyCost: 12,
    id: " ",
    energyConsumption: "15135w",
    devices: devices,
  };
  const showModal = (type: number) => {
    //setSelectedType(type);
    setModalVisible(true);
  };

  const handleOk = () => {
    // form.validateFields().then((values) => {
    //   // create  IRoomDevice obj
    //   const device = {
    //     type: selectedType!,
    //     name: values.name,
    //     power: values.power,
    //     uptime: values.uptime,
    //     workingDayTime: values.workingDayTime,
    //   };
    //   handleAddDevice(device);
    setModalVisible(false);
    form.resetFields();
    // });
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

  const handleAddingRoom = async () => {
    console.log("handleAddingRoom", userId);
    if (!userId) return;

    const finalRoom = {
      ...room,
      id: roomId ? existingRoom?.id || "" : randomId,
      devices,
    };

    try {
      if (roomId) {
        console.log("roomId=", roomId);
        await dispatch(updateRoom({ userId, roomObject: finalRoom }));
      } else {
        console.log("else", finalRoom);
        await dispatch(addRoom({ userId, roomObject: finalRoom }));
      }

      navigate(`${ROOM_PATH}/${randomId}`);
    } catch (err) {
      console.error("Operation failed:", err);
    }
  };

  return {
    handleAddingRoom,
    singleRoomPage: (
      <div
        className="single-room"
        style={{ width: "100vh", height: "100vh" }}
      />

      //   <Layout style={{ height: "100vh" }}>
      //     {/* <Content className="kkkkkk" style={{ flex: 1 }}>
      //       {threeScene}
      //     </Content> */}
      //     <Sider width={400} style={{ background: "#fff", padding: 16 }}>
      //       <h3>Devices</h3>
      //       <List
      //         dataSource={DEVICE_SELECT_OPTONS}
      //         renderItem={(item) => (
      //           <List.Item>
      //             <Button type="primary" onClick={() => showModal(item.type)}>
      //               {item.icon} {item.label}
      //             </Button>
      //           </List.Item>
      //         )}
      //       />
      //     </Sider>

      //     <Modal
      //       title="add device"
      //       open={modalVisible}
      //       onOk={handleOk}
      //       onCancel={handleCancel}
      //       okText="Add"
      //     >
      //       <Form
      //         form={form}
      //         layout="vertical"
      //         initialValues={{ workingDayTime: DayTime.Day }}
      //       >
      //         <Form.Item
      //           name="name"
      //           label="Name"
      //           rules={[
      //             { required: true, message: "Please enter device name" },
      //             { min: 3, message: "min 3 charachter" },
      //           ]}
      //         >
      //           <Input minLength={3} maxLength={15} />
      //         </Form.Item>

      //         <Form.Item
      //           name="power"
      //           label="Power"
      //           rules={[{ required: true, message: "Please enter device power" }]}
      //         >
      //           <InputNumber min={0} style={{ width: "100%" }} />
      //         </Form.Item>

      //         <Form.Item
      //           name="uptime"
      //           label="Uptime (minute)"
      //           rules={[{ required: true, message: "please enter uptime " }]}
      //         >
      //           <InputNumber min={0} max={1440} style={{ width: "100%" }} />
      //         </Form.Item>

      //         <Form.Item
      //           name="workingDayTime"
      //           label="Working on Day"
      //           rules={[{ required: true, message: "please choose time on day" }]}
      //         >
      //           <Select>
      //             <Option value={DayTime.Day}>Day</Option>
      //             <Option value={DayTime.Night}>Night</Option>
      //           </Select>
      //         </Form.Item>
      //       </Form>
      //     </Modal>
      //   </Layout>
    ),
  };
};

export default useAddRooms;
