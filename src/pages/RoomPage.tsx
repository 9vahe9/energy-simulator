import { Select } from "antd";
import { DEVICE_SELECT_OPTONS } from "../constants/Devices";

const RoomPage = () => {
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
    </div>
  );
};

export default RoomPage;
