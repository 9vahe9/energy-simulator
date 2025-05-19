import type { DayTime } from "../constants/DayTime";
import type { DeviceType } from "../constants/Devices";

export interface IRoomDevice {
  type: DeviceType;
  name: string;
  power: number;
  uptime: number;
  workingDayTime: DayTime;
}

export interface IDeviceSelectOption {
  type: DeviceType;
  label: string;
}
