import { Select, Button } from "antd";
import { DEVICE_SELECT_OPTONS } from "../../constants/Devices";
import { useSelector, useDispatch } from "react-redux";
import { addRoom } from "../../store/user/userSlice";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../store/store";
import { DASHBOARD_PATH } from "../../constants/RoutePaths";

const RoomContainer = () => {
  const dispatch = useDispatch();
  //const roomsArray = useSelector((state:RootState) => state.user.rooms);
  const navigate = useNavigate();

  // function handleAddingRoom(){
  //     dispatch(addRoom({
  //       name: "kitchen",
  //       description: "Place where we eat stuff",
  //       levelOfEnergyConsumption: "Red",
  //       monthlyCost: "1000 usd",
  //       energyConsumption: "1000 watts",
  //     }))
  //     navigate(DASHBOARD_PATH);
  // }

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
      </div>
      <Button onClick = {handleAddingRoom}>Add the Room</Button>
    </div>
  );
};

export default RoomContainer;
