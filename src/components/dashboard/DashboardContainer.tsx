import "./dashboard.css";
import {
  Input,
  Button,
  Form,
  Typography,
  Row,
  Col,
  Space,
  Modal,
  Affix,
} from "antd";

import type { RootState, AppDispatch } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../../store/authentication/authSlice";
import { useNavigate } from "react-router-dom";
import { HOME_PATH, REPORT_PATH, ROOM_PATH } from "../../constants/RoutePaths";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig/firebase";
import { useEffect, useState, useMemo } from "react";
import useAddRooms from "../../hooks/useAddRooms";
import React from "react";
import {
  PlusOutlined,
  SortAscendingOutlined,

  SearchOutlined,
  EditOutlined,
  ThunderboltFilled,
  AreaChartOutlined,
} from "@ant-design/icons";
import "./dashboard.css";
import { fetchRooms, deleteRoom } from "../../store/user/userSlice";
import { RoomCards } from "../roomCards/RoomCards";
import Search from "antd/es/transfer/search";

import { useTranslation } from "react-i18next";

export const DashboardContainer: React.FC = () => {
  const { Title, Text } = Typography;
  let roomsArray = useSelector((state: RootState) => state.user.rooms);
  const userName = useSelector((state: RootState) => state.user.userName);
  const [userSearch, setUserSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [totalEnergy, setTotalEnergy] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const { handleAddingRoom } = useAddRooms();
  const [isSorted, setIsSorted] = useState(false);
 
  useEffect(() => {
    if (roomsArray.length > 0) {
      let waste = 0;
      roomsArray.forEach((room) => {
        waste += room.devices.reduce((acc, curr) => {
          const e = ((curr.power / 1000) * curr.uptime) / 60;
          acc += e;
          return acc;
        }, 0);
      });

      setTotalEnergy(Number(waste.toFixed(2)));
    }
  }, [roomsArray]);

  useEffect(() => {
    if (roomsArray.length > 0) {
      setTotalCost(
        roomsArray.reduce((accum, room) => {
          return (accum += room.cost);
        }, 0)
      );
    }
  }, [roomsArray]);


  const { t } = useTranslation();

  const userID = useSelector((state: RootState) => state.auth.userToken);


const filteredRooms =  roomsArray.filter(room => room.name.toLowerCase().includes(userSearch.toLowerCase()))
  

const sortedFilteredRooms = useMemo(() => {
  const arr = [...filteredRooms];
  return arr.sort((a, b) => b.energy - a.energy);
}, [filteredRooms]);

const displayedRooms = isSorted ? sortedFilteredRooms : filteredRooms;

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
                icon={<AreaChartOutlined />}
                className="report-button"
                onClick={handleReportButton}

              >
                {t("dashboard.reportButton")}
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
                {t("dashboard.addButton")}
              </Button>
              <Modal
                title={t("dashboard.Modal.title")}
                open={modalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={t("dashboard.Modal.ok")}
                cancelText={t("dashboard.Modal.cancel")}
              >
                <Form form={form} layout="vertical">
                  <Form.Item
                    name="name"
                    label={t("dashboard.Modal.name")}
                    rules={[
                      {
                        required: true,
                        message: t("dashboard.Modal.nameMessage"),
                      },
                      { min: 3, message: t("dashboard.Modal.nameVal") },
                    ]}
                  >
                    <Input minLength={3} maxLength={15} />
                  </Form.Item>
                  <Form.Item
                    name="description"
                    label={t("dashboard.Modal.description")}
                    rules={[
                      {
                        required: false,
                        message: t("dashboard.Modal.descriptionMessage"),
                      },
                      { min: 3, message: t("dashboard.Modal.descrVal") },
                    ]}
                  >
                    <Input minLength={3} maxLength={150} />
                  </Form.Item>
                </Form>
              </Modal>
              <Button
                onClick = {() => setIsSorted(true)}
                icon={<SortAscendingOutlined />}
                style={{ marginLeft: 12 }}
              >
                {t("dashboard.sortButton")}
              </Button>
            </Space>
          </Col>
          <Col className="header-summary">
            <Space>
              <Text>{t("dashboard.totalEnergy") + `  ${totalEnergy}`}</Text>
              <Text>{t("dashboard.cost") + ` ${totalCost}`}</Text>
            </Space>
          </Col>
          <Col className="header-right">
            <Search
              placeholder={t("dashboard.search")}
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </Col>
        </Row>
      </div>
      <div className="wrapper">
        <Row gutter={[24, 24]}>
          {displayedRooms.length > 0 &&
            displayedRooms.map(
              (room) =>
                room.name !== " " && (
                  <Col  key={room.id} xs={24} sm={12} xl={6}
                  >
                    <RoomCards
                      
                      name={room.name}
                      id={room.id}
                      priority={1}
                      energy={room.energy}
                      icons={room.devices}
                      cost={room.cost}
                      deleteFunction={handleDelete}
                      editRoomFunction={handleEditRoom}
                      devices={room.devices}
                      description={room.description}
                    />
                  </Col>
                )
            )}
        </Row>
      </div>
      <Affix offsetBottom={16}>
        <Button onClick={handleLogOut}>{t("dashboard.logout")}</Button>
      </Affix>
    </div>
  );
};
