import "./dashboard.css";
import {
  Input,
  Button,
  Form,
  Typography,
  Row,
  Col,
  Card,
  Tag,
  Space,
  Progress,
  Popconfirm,
} from "antd";
import type { RootState, AppDispatch } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../../store/authentication/authSlice";
import { useNavigate } from "react-router-dom";
import { HOME_PATH, ROOM_PATH } from "../../constants/RoutePaths";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig/firebase";
import { useEffect, useState } from "react";
import React from "react";
import {
  PlusOutlined,
  SortAscendingOutlined,
  SearchOutlined,
  EditOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";
import "./dashboard.css";

import { fetchRooms, deleteRoom } from "../../store/user/userSlice";
import { RoomCards } from "../roomCards/RoomCards";

export const DashboardContainer: React.FC = () => {
  const { Title, Text } = Typography;

  let roomsArray = useSelector((state: RootState) => state.user.rooms);
  const userName = useSelector((state: RootState) => state.user.userName);
  const [userSearch, setUserSearch] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const userID = useSelector((state: RootState) => state.auth.userToken);

  console.log(userID);

  const filteredRooms = roomsArray.filter((room) => {
    return room.name.toLowerCase().includes(userSearch.toLowerCase());
  });

  useEffect(() => {
    if (userID) {
      dispatch(fetchRooms(userID));
    }
  }, [dispatch, userID]);

  function handleLogOut() {
    signOut(auth).then(() => {
      dispatch(setCurrentUser(null));
      sessionStorage.setItem("userToken", "");
      navigate(HOME_PATH);
      console.log(userID);
    });
  }

  function handleDelete(id: string) {
    dispatch(deleteRoom(id));
  }

  function handleEditRoom(id: string) {
    navigate(`${ROOM_PATH}/${id}`);
  }

  return (
    <div className="dashboard-container">
      {userName}
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
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />

            <Button>Search</Button>
          </div>
        </div>
      </div>

      <div>
        {filteredRooms.length > 0 &&
          filteredRooms.map(
            (room) =>
              room.name !== " " && (
                <RoomCards
                  key={room.id}
                  name={room.name}
                  id={room.id}
                  priority={room.energyConsumption}
                  energy={room.levelOfEnergyConsumption}
                  icons={room.devices}
                  cost={room.monthlyCost}
                  deleteFunction={handleDelete}
                  editRoomFunction={handleEditRoom}
                />
              )
          )}
      </div>

      <Button onClick={handleLogOut}>Log out</Button>
    </div>
  );
};
