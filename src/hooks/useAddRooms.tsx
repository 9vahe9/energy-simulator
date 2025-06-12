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

  const setRoomData = (name: string, description: string) => {
    setRoomName(name);
    setDescription(description);
  };

  const showModal = (type: number) => {
    setModalVisible(true);
  };

  const handleOk = () => {
    setModalVisible(false);
    form.resetFields();
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

  const handleAddingRoom = async (name: string, description: string) => {
    console.log("roomName перед сохранением:", name);

    const room: Room = {
      name,
      description,
      levelOfEnergyConsumption: "15w",
      monthlyCost: 12,
      id: " ",
      energyConsumption: "15135w",
      devices: devices,
    };

    const finalRoom = {
      ...room,
      id: roomId ? existingRoom?.id || "" : randomId,
      devices,
    };

    try {
      if (roomId) {
        await dispatch(updateRoom({ userId, roomObject: finalRoom }));
      } else {
        await dispatch(addRoom({ userId, roomObject: finalRoom }));
      }

      navigate(`${ROOM_PATH}/${randomId}`);
    } catch (err) {
      console.error("Operation failed:", err);
    }
  };

  return {
    handleAddingRoom,
    setRoomData,
    singleRoomPage: (
      <div
        className="single-room"
        style={{ width: "100vh", height: "100vh" }}
      />
    ),
  };
};

export default useAddRooms;
