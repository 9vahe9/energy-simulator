import type { IDeviceSelectOption } from "../types/device";
import {
  BulbOutlined,
  PhoneOutlined,
  PrinterOutlined,
} from "@ant-design/icons";

export enum DeviceType {
  Refrigerator = 1,
  VacuumCleaner,
  AirConditioner,
  TV,
  Phone,
  PC,
  Printer,
  MFU,
  Iron,
  Hairdryer,
  Fan,
  Heater,
  Humidifier,
  Lighting,
  Microwave,
  ElectricKettle,
  Dishwasher,
  Mixer,
  Juicer,
  ElectricOven,
  Other,
}

export const DEVICE_SELECT_OPTONS: IDeviceSelectOption[] = [
  {
    type: DeviceType.Refrigerator,
    label: "Refrigerator",
    icon: <BulbOutlined />,
  },
  {
    type: DeviceType.VacuumCleaner,
    label: "Vacuum Cleaner",
    icon: <BulbOutlined />,
  },
  {
    type: DeviceType.AirConditioner,
    label: "Air Conditioner",
    icon: <BulbOutlined />,
  },
  { type: DeviceType.TV, label: "TV", icon: <BulbOutlined /> },
  { type: DeviceType.Phone, label: "Phone", icon: <PhoneOutlined /> },
  { type: DeviceType.PC, label: "PC", icon: <BulbOutlined /> },
  { type: DeviceType.Printer, label: "Printer", icon: <PrinterOutlined /> },
  { type: DeviceType.MFU, label: "MFU", icon: <PrinterOutlined /> },
  { type: DeviceType.Iron, label: "Iron", icon: <BulbOutlined /> },
  { type: DeviceType.Hairdryer, label: "Hairdryer", icon: <BulbOutlined /> },
  { type: DeviceType.Fan, label: "Fan", icon: <BulbOutlined /> },
  { type: DeviceType.Heater, label: "Heater", icon: <BulbOutlined /> },
  { type: DeviceType.Humidifier, label: "Humidifier", icon: <BulbOutlined /> },
  { type: DeviceType.Lighting, label: "Lighting", icon: <BulbOutlined /> },
  { type: DeviceType.Microwave, label: "Microwave", icon: <BulbOutlined /> },
  {
    type: DeviceType.ElectricKettle,
    label: "Electric Kettle",
    icon: <BulbOutlined />,
  },
  { type: DeviceType.Dishwasher, label: "Dishwasher", icon: <BulbOutlined /> },
  { type: DeviceType.Mixer, label: "Mixer", icon: <BulbOutlined /> },
  { type: DeviceType.Juicer, label: "Juicer", icon: <BulbOutlined /> },
  {
    type: DeviceType.ElectricOven,
    label: "Electric Oven",
    icon: <BulbOutlined />,
  },
  { type: DeviceType.Other, label: "Other", icon: <BulbOutlined /> },
];
