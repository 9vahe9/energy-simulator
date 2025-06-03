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

  Modal,
  InputNumber,

} from "antd";
import type { RootState, AppDispatch } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../../store/authentication/authSlice";
import { useNavigate } from "react-router-dom";
import { HOME_PATH, ROOM_PATH } from "../../constants/RoutePaths";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig/firebase";
import { useEffect, useState } from "react";
import useAddRooms from "../../hooks/useAddRooms";
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
import Search from "antd/es/transfer/search";

export const DashboardContainer: React.FC = () => {
  const { Title, Text } = Typography;
  const { singleRoomPage, handleAddingRoom, setRoomData } = useAddRooms();

  let roomsArray = useSelector((state: RootState) => state.user.rooms);
  const userName = useSelector((state: RootState) => state.user.userName);
  const [userSearch, setUserSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const userID = useSelector((state: RootState) => state.auth.userToken);

  console.log(userID);

  const filteredRooms = roomsArray.filter((room) => {
    return room.name.toLowerCase().includes(userSearch.toLowerCase());
  });
 dev
  const showModal = () => {
    setModalVisible(true);
  };
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setRoomData(values.name, values.description || "");
      await handleAddingRoom();
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };



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

      <Title level={2}>Room Energy Management</Title>
      <div className="wrapper">
        <Row className="dashboard-header" justify="space-between">
          <Col className="header-left">
            <Space>
              <Text italic style={{ margin: 0 }}>
                {userName}
              </Text>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ marginLeft: 16 }}
                onClick={() => showModal()}
                className="add-room-button"
              >
                Add New Room
              </Button>
              <Modal
                title="add device"
                open={modalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Add"
              >
                <Form form={form} layout="vertical">
                  <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                      { required: true, message: "Please enter room name" },
                      { min: 3, message: "min 3 charachter" },
                    ]}
                  >
                    <Input minLength={3} maxLength={15} />
                  </Form.Item>
                  <Form.Item
                    name="description"
                    label="Description"
                    rules={[
                      {
                        required: false,
                        message: "Please enter room description",
                      },
                      { min: 3, message: "min 150 charachter" },
                    ]}
                  >
                    <Input minLength={3} maxLength={150} />
                  </Form.Item>
                </Form>
              </Modal>
              <Button
                icon={<SortAscendingOutlined />}
                style={{ marginLeft: 12 }}
              >
                Sort Rooms
              </Button>
            </Space>
          </Col>
          <Col className="header-summary">
            <Space>
              <Text>Total Energy Consumption։</Text>
              <Title level={4} style={{ margin: 0 }}>
                {/* {totalEnergy} */}
              </Title>
              <Text>Monthly Cost։</Text>
              <Title level={4} style={{ margin: 0 }}>
                {/* {totalCost} */}
              </Title>
            </Space>
          </Col>
          <Col className="header-right">
            <Search
              placeholder="Search rooms..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </Col>
        </Row>
      </div>
      <div className="wrapper">
        <Row gutter={[24, 24]}>
          {filteredRooms.length > 0 &&
            filteredRooms.map(
              (room) =>
                room.name !== " " && (
                  <Col xs={24} sm={12} xl={6}>
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
                  </Col>
                )
            )}
        </Row>
      </div>

      <Button onClick={handleLogOut}>Log out</Button>
      </div>
  );
};
