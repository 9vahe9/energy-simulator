import type { DayTime } from "../constants/DayTime";
import type { DeviceType } from "../constants/Devices";

export interface IRoomDevice {
  //one device in room
  type: DeviceType;
  name: string;
  power: number;
  uptime: number;
  workingDayTime: DayTime;
  deviceId: number
}

export interface IDeviceSelectOption {
  type: DeviceType;
  label: string;
  icon?: React.ReactNode;
}
