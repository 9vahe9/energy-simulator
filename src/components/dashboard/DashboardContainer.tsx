import "./dashboard.css";
import { Input, Button, Typography } from "antd";
import type { RootState, AppDispatch } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../../store/authentication/authSlice";
import { useNavigate } from "react-router-dom";
import { HOME_PATH, ROOM_PATH } from "../../constants/RoutePaths";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig/firebase";
import { fetchRooms } from "../../store/user/userSlice";
import { useEffect } from "react";
import React from "react";
import {
  PlusOutlined,
  SortAscendingOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import "./dashboard.css";
import type { IRoom } from "../../types/room";
import { RoomCards } from "../roomCards/RoomCards";

import GptSearch from "../dashboard/GptSearch";

// Заглушка данных — позже заменим на Firebase
const roomsData: IRoom[] = [
  {
    id: "1",
    name: "Living Room",
    description: "Main entertainment area",
    energy: 420,
    cost: 50.4,
    priority: "High",
    devices: [],
    icons: [
      { type: "TV", count: 4 },
      { type: "Lighting", count: 6 },
      { type: "Humidifier", count: 1 },
    ],
  },
  {
    id: "2",
    name: "Kitchen",
    description: "Cooking and dining area",
    energy: 325,
    cost: 39,
    priority: "Medium",
    devices: [],
    icons: [
      { type: "Magnifier", count: 2 },
      { type: "Humidifier", count: 1 },
      { type: "Fire", count: 3 },
    ],
  },
  {
    id: "3",
    name: "Master Bedroom",
    description: "Primary sleeping area",
    energy: 180,
    cost: 21.6,
    priority: "Low",
    devices: [],
    icons: [
      { type: "Lighting", count: 3 },
      { type: "TV", count: 1 },
      { type: "ElectricKettle", count: 4 },
    ],
  },
];

export const DashboardContainer: React.FC = () => {
  // Считаем общие показатели
  const totalEnergy = roomsData.reduce((sum, r) => sum + r.energy, 0);
  const totalCost = roomsData.reduce((sum, r) => sum + r.cost, 0);
  const { Title, Text } = Typography;

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const userID = useSelector((state: RootState) => state.auth.userToken);
  const roomsArray = useSelector((state: RootState) => state.user.rooms);

  console.log(userID);

  useEffect(() => {
    if (userID) {
      dispatch(fetchRooms(userID));
    }
  }, [dispatch, userID]);

  console.log(roomsArray);

  function handleLogOut() {
    signOut(auth).then(() => {
      dispatch(setCurrentUser(null));
      sessionStorage.setItem("userToken", "");
      navigate(HOME_PATH);
      console.log(userID);
    });
  }

  console.log(roomsArray);

  return (
    <div className="dashboard-container">
      {/* header */}
      <div className="dashboard-header">
        <div className="header-left">
          <Title level={3} style={{ margin: 0 }}>
            Room Energy Management
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="add-room-button"
          >
            Add New Room
          </Button>
          <Button icon={<SortAscendingOutlined />} style={{ marginLeft: 12 }}>
            Sort Rooms
          </Button>
        </div>

        <div className="header-right">
          <div className="header-summary">
            <Text>Total Energy Consumption</Text>
            <Title level={4} style={{ margin: 0 }}>
              {totalEnergy.toLocaleString()} kWh
            </Title>
            <Text>Monthly Cost</Text>
            <Title level={4} style={{ margin: 0 }}>
              ${totalCost.toFixed(2)}
            </Title>
          </div>
          <div className="header-search">
            <Input
              placeholder="Search rooms..."
              prefix={<SearchOutlined />}
              allowClear
            />
          </div>
        </div>
      </div>
      {/* Секция с GPT-поиском */}
      <div className="gpt-search-section" style={{ margin: "20px 0" }}>
        <GptSearch />
      </div>
      {/* Room card */}
      <div className="room-cards">
        {roomsData.map((room) => {
          return (
            <RoomCards
              id={room.id}
              name={room.name}
              priority={room.priority}
              energy={room.energy}
              cost={room.cost}
              icons={room.icons}
            />
          );
        })}
        <Button onClick={handleLogOut}>Log out</Button>
      </div>
    </div>
  );
};

export default DashboardContainer;
