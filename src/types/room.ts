import type { IRoomDevice } from "./device";

export interface IRoom {
  name: string;
  devices: IRoomDevice[];
}
