import { Select, Button } from "antd";
import { DEVICE_SELECT_OPTONS } from "../../constants/Devices";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { AppDispatch, RootState } from "../../store/store";
import { DASHBOARD_PATH } from "../../constants/RoutePaths";
import { addRoom, type Device, type Room, updateRoom } from "../../store/user/userSlice";



const RoomContainer = () => {

  
  const { roomId } = useParams<{ roomId?: string }>();
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [devices, setDevices] = useState<Device[]>([]);


  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const userId: string = useSelector((state: RootState) => state.auth.userToken);

const randomId = (() => {
  const now = new Date();
  return [
    now.getDate(),
    now.getMonth() + 1,
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
  ]
    .map(n => String(n).padStart(2, "0"))
    .join("_");
})();


  const existingRoom = useSelector((state: RootState) => {
    return roomId ? state.user.rooms.find((r) => r.id === roomId) : undefined
  });

  useEffect(() => {
    if (existingRoom) {
      setRoomName(existingRoom.name);
      setDescription(existingRoom.description);
      setDevices(existingRoom.devices);
    }
  }, [existingRoom])

  const room: Room = {
    name: roomName,
    description: description,
    levelOfEnergyConsumption: "15w",
    monthlyCost: "12$",
    id: " ",
    energyConsumption: "15135w",
    devices: devices,
  }


  function handleDeletingDevice(id: string){
    
    setDevices(devices.filter((device) => device.deviceId !== id))
  
  }

  function handleAddingDevice(device: Device) {
      setDevices([...devices, device]);
  }

  const handleAddingRoom = async () => {
    if (!userId) return;
  const finalRoom = {
    ...room,
    id: roomId ? (existingRoom?.id || "") : randomId, devices,
  };

    try {
      if (roomId) {
        await dispatch(updateRoom({ userId,  roomObject: finalRoom }));
      } else {
        await dispatch(addRoom({ userId, roomObject: finalRoom }));
      }
      navigate(DASHBOARD_PATH);
    } catch (err) {
      console.error("Operation failed:", err);
    }
  };

  return (
    <div>
      <div>
        <h1> Add new device</h1>
        <Select placeholder="select a device">
          {DEVICE_SELECT_OPTONS.map((device) => (
            <Select.Option key={device.type} value={device.type}>
              {device.label}
            </Select.Option>
          ))}
        </Select>

        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter the room name"
        />

        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter the rooms description"
        />

      </div>
      {<Button onClick={handleAddingRoom}>Add the Room</Button>}
    </div>
  );
};

export default RoomContainer;
