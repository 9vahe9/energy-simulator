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
  updateRoom,
} from "../store/user/userSlice";
import type { IRoomDevice } from "../types/device.ts";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { DayTime } from "../constants/DayTime.ts";
import type { IRoom } from "../types/room.ts";
import { executeQuery } from "firebase/data-connect";
//const { Content } = Layout;


const useAddRooms = () => {
  const { roomId } = useParams<{ roomId?: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const userId: string = useSelector(
    (state: RootState) => state.auth.userToken
  );
  const existingRoom = useSelector((state: RootState) => {
    return roomId ? state.user.rooms.find((r) => r.id === roomId) : undefined;
  });

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




  const handleAddingRoom = async (name: string, description: string, devices: IRoomDevice[]) => {
    
    if (!userId) return;

    const totalEnergy = devices.reduce((sum, device) => sum + device.power, 0);

    const room: IRoom = {
      name: name || existingRoom?.name || " ",
      description: description || existingRoom?.description || " ",
      energy: totalEnergy,
      cost: 0,
      id: roomId || randomId,
      priority: existingRoom?.priority || 'Low',
      devices,
      icons: existingRoom?.icons || [],
    };



    try {
      if (roomId) {
       
        await dispatch(updateRoom({ userId, roomObject: room }));

        navigate(DASHBOARD_PATH);
      } else {
        await dispatch(addRoom({ userId, roomObject: room }));
        navigate(`${ROOM_PATH}/${randomId}`);
      }

    } catch (err) {
      console.error("Operation failed:", err);
    }
  };

 return {  handleAddingRoom };
};

export default useAddRooms;
