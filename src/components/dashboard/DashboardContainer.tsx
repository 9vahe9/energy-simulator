import "./dashboard.css"
import { Input, Button, Form, Typography, Row, Col, Card, Tag, Space, Progress } from 'antd';
import type { RootState, AppDispatch } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../../store/authentication/authSlice";
import { useNavigate } from "react-router-dom";
import { HOME_PATH, ROOM_PATH } from "../../constants/RoutePaths";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig/firebase";
import { useEffect } from "react";
import React from "react";
import {
  PlusOutlined,
  SortAscendingOutlined,
  SearchOutlined,
  EditOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";
import "./dashboard.css";
import type { IRoom } from "../../types/room";
import { fetchRooms, deleteRoom } from "../../store/user/userSlice";



// Маппинг «тип устройства» → эмодзи
const ICON_MAP: Record<string, string> = {
  TV: "📺",
  Lighting: "💡",
  Humidifier: "❄️",
  Magnifier: "🔍",
  Fire: "🔥",
};

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

  // const totalEnergy = roomsData.reduce((sum, r) => sum + r.energy, 0);
  // const totalCost = roomsData.reduce((sum, r) => sum + r.cost, 0);
  const { Title, Text } = Typography;

  const roomsArray = useSelector((state: RootState) => state.user.rooms);
 
  

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const userID = useSelector((state: RootState) => state.auth.userToken)

  console.log(userID);

  useEffect(() => {
    if (userID) {
      dispatch(fetchRooms(userID));
    }
  }, [dispatch, userID]);

  function handleLogOut() {
    signOut(auth)
      .then(() => {
        dispatch(setCurrentUser(null));
        sessionStorage.setItem("userToken", "");
        navigate(HOME_PATH);
        console.log(userID);
      })

  }

  function handleDelete(id: string) {

    dispatch(deleteRoom(id))

  }

  function handleEditRoom(id: string){
    navigate(`${ROOM_PATH}/${id}`)
  }


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
            style={{ marginLeft: 16 }}
            onClick={() => navigate(ROOM_PATH)}
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
              {/* {totalEnergy.toLocaleString()} kWh */}
            </Title>
            <Text>Monthly Cost</Text>
            <Title level={4} style={{ margin: 0 }}>
              {/* ${totalCost.toFixed(2)} */}
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

      {/* Room card */}
      <div className="room-cards">
        {roomsData.map((room) => (
          <div key={room.id} className="room-card">
            {/* Название и приоритет */}
            <div className="card-header">
              <Title level={4} style={{ margin: 0 }}>
                {room.name}
              </Title>
              <Tag
                icon={<ThunderboltFilled />}
                className={
                  room.priority === "High"
                    ? "priority-tag-high"
                    : room.priority === "Medium"
                      ? "priority-tag-medium"
                      : "priority-tag-low"
                }
              >
                {room.priority}
              </Tag>
            </div>

            {/* Card body */}
            <div className="card-body"></div>

            {/* Statics */}
            <div className="card-stats">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Text>Energy Consumption</Text>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Progress
                    percent={Math.round((room.energy / 500) * 100)}
                    showInfo={false}
                  />
                  <Text strong>{room.energy} kWh</Text>
                </div>

                <Text>Monthly Cost</Text>
                <Text strong>${room.cost.toFixed(2)}</Text>
              </Space>
            </div>

            {/* Icon Device */}
            <div className="device-icons">
              {room.icons.map((ic) => (
                <Space key={ic.type}>
                  <span>{ICON_MAP[ic.type] || "🔌"}</span>
                  <Text>{ic.count}</Text>
                </Space>
              ))}
            </div>

            {/* Button edit */}
            <Button
              type="primary"
              icon={<EditOutlined />}
              className="ant-btn-edit"
            >
              Edit Room
            </Button>
          </div>

        ))}

      </div>
      <div>
        {roomsArray.length > 0 && roomsArray.map((room) => (
         room.name !== " " && <div>
            <p>{room.name}</p>
            <p>{room.description}</p>
            <button onClick={() => handleDelete(room.id)}> DeleteRoom </button>
            <button onClick={() => handleEditRoom(room.id)}> Edit Room </button>
          </div>
        ))}
      </div>
      <Button onClick={handleLogOut}>Log out</Button>
    </div>
  );
};

