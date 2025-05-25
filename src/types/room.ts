// src/types/room.ts
import type { IRoomDevice } from './device';

export interface IRoom {
  id: string;
  name: string;
  description: string;
  energy: number;
  cost: number;
  priority: 'High' | 'Medium' | 'Low';
  devices: IRoomDevice[];        // для реальной выборки из Firebase
  icons: { type: string; count: number }[]; // плейсхолдер для UI
}
