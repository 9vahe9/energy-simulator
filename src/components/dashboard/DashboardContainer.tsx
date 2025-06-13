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
import {
  PlusOutlined,
  SortAscendingOutlined,
  SearchOutlined,
  EditOutlined,
  ThunderboltFilled,
  AreaChartOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import type { RootState, AppDispatch } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../../store/authentication/authSlice";
import { useNavigate } from "react-router-dom";
import { HOME_PATH, REPORT_PATH, ROOM_PATH } from "../../constants/RoutePaths";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig/firebase";
import { useEffect, useState } from "react";
import useAddRooms from "../../hooks/useAddRooms";
import React from "react";
import { fetchRooms, deleteRoom } from "../../store/user/userSlice";
import { RoomCards } from "../roomCards/RoomCards";
import Search from "antd/es/transfer/search";
import { useTranslation } from "react-i18next";
import { AIChatModal } from "../AIchatModal/AIChatModal";

export const DashboardContainer: React.FC = () => {
  const { Title, Text } = Typography;
  let roomsArray = useSelector((state: RootState) => state.user.rooms);
  const userName = useSelector((state: RootState) => state.user.userName);
  const [userSearch, setUserSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [aiChatVisible, setAiChatVisible] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { handleAddingRoom } = useAddRooms();
  const { t } = useTranslation();
  const userID = useSelector((state: RootState) => state.auth.userToken);

  const filteredRooms = roomsArray.filter((room) => {
    return room.name.toLowerCase().includes(userSearch.toLowerCase());
  });

  const showModal = () => {
    setModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await handleAddingRoom(values.name, values.description, []);
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error(t("dashboard.valError"), error);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const showAIChat = () => {
    setAiChatVisible(true);
  };

  const handleAIChatClose = () => {
    setAiChatVisible(false);
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
    });
  }

  function handleDelete(id: string) {
    dispatch(deleteRoom(id));
  }

  function handleEditRoom(id: string) {
    navigate(`${ROOM_PATH}/${id}`);
  }

  function handleReportButton() {
    navigate(REPORT_PATH);
  }

  return (
    <div className="dashboard-container">
      <div className="wrapper">
        <Row className="dashboard-title" justify="space-between" align="middle">
          <Col>
            <Title level={2}>Room Energy Management</Title>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<RobotOutlined />}
                className="ai-chat-button"
                onClick={showAIChat}
              >
                AI Assistant
              </Button>
              <Button
                type="primary"
                icon={<AreaChartOutlined />}
                className="report-button"
                onClick={handleReportButton}
              >
                Report
              </Button>
              <Text italic style={{ margin: 0 }}>
                {userName}
              </Text>
            </Space>
          </Col>
        </Row>
        <Row className="dashboard-header" justify="space-between">
          <Col className="header-left">
            <Space>
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
                title="Add Device"
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
                      { min: 3, message: "min 3 characters" },
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
                      { min: 3, message: "min 150 characters" },
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
              <Text>Total Energy Consumption:</Text>
              <Title level={4} style={{ margin: 0 }}>
                {/* {totalEnergy} */}
              </Title>
              <Text>Monthly Cost:</Text>
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
                      priority={1}
                      energy={room.energy}
                      icons={room.devices}
                      cost={room.cost}
                      deleteFunction={handleDelete}
                      editRoomFunction={handleEditRoom}
                    />
                  </Col>
                )
            )}
        </Row>
      </div>
      <AIChatModal visible={aiChatVisible} onClose={handleAIChatClose} />
      <Button onClick={handleLogOut}>Log out</Button>
    </div>
  );
};
