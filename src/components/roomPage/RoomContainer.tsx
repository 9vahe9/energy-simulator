import { Select, Button } from "antd";
import { DEVICE_SELECT_OPTONS } from "../../constants/Devices";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { AppDispatch, RootState } from "../../store/store";
import { DASHBOARD_PATH } from "../../constants/RoutePaths";
import { addRoom, type Room, updateRoom } from "../../store/user/userSlice";

const randomNumber = Math.random();

const RoomContainer = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId?: string }>();
  const [roomName, setRoomName] = useState("");
  const [description, setDecription] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const userId: string = useSelector((state: RootState) => state.auth.userToken);




  const existingRoom = useSelector((state: RootState) => {
    return roomId ? state.user.rooms.find((r) => r.id === roomId) : undefined
  });

  useEffect(() => {
    if (existingRoom) {
      setRoomName(existingRoom.name);
      setDecription(existingRoom.description);
    }
  }, [existingRoom])

  const room: Room = {
    name: roomName,
    description: description,
    id: `${randomNumber}`,
    levelOfEnergyConsumption: "15w",
    monthlyCost: "12$",
    energyConsumption: "15135w",
    devices: [{
      name: "microwave",
      wattage: "12142",
    }]
  }

  function handleAddingRoom() {

    if(roomId){
      dispatch(updateRoom({userId, 
        roomObject: {...room }
      }))
    }
    else{
      dispatch(addRoom({userId, roomObject:{...room}}))
    }

    navigate(DASHBOARD_PATH)

  }

  return (
    <div>
      <div>
        <h1> add new device</h1>
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
          onChange={(e) => setDecription(e.target.value)}
          placeholder="Enter the rooms description"
        />

      </div>
      {<Button onClick={handleAddingRoom}>Add the Room</Button>}
    </div>
  );
};

export default RoomContainer;
