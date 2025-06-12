import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import type { AppDispatch, RootState } from "../store/store";
import { DASHBOARD_PATH, ROOM_PATH } from "../constants/RoutePaths";
import { addRoom, updateRoom } from "../store/user/userSlice";
import type { IRoomDevice } from "../types/device.ts";
import type { IRoom } from "../types/room.ts";


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

  const handleAddingRoom = async (
    name: string,
    description: string,
    devices: IRoomDevice[]
  ) => {
    if (!userId) return;
    console.log(devices, "devices");
    const totalEnergy = devices.reduce((sum, device) => sum + device.power, 0);
    const cost = totalEnergy * 0.12;

    const room: IRoom = {
      name: name || existingRoom?.name || " ",
      description: description || existingRoom?.description || " ",
      energy: totalEnergy,
      cost: cost,
      id: roomId || randomId,
      priority: existingRoom?.priority || "Low",
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

  return { handleAddingRoom };
};

export default useAddRooms;
