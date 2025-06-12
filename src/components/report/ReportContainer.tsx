import { Row, Col, Typography, Button, Space, Tag, Tabs, Flex, Progress, Splitter } from "antd";
import { DownloadOutlined, CalendarOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
<<<<<<< dev
import { useTabs } from "../../constants/ReportTabs";
import "./report.css"
import { fetchRooms } from "../../store/user/userSlice";
import type { AppDispatch } from "../../store/store";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";
import { DASHBOARD_PATH } from "../../constants/RoutePaths";
import { ReportDownloadButton } from "./ReportDownloadButton";

const { Title, Text } = Typography;

export const ReportContainer = () => {
    const userName = useSelector((state: RootState) => state.user.userName);
    const userId = useSelector((state: RootState) => state.auth.userToken);
    const roomsArray = useSelector((state: RootState) => state.user.rooms);
    const [month, setMonth] = useState("");
    const dispatch = useDispatch<AppDispatch>();

    const navigate = useNavigate();

    const { t } = useTranslation();
    const tabs = useTabs();


    useEffect(() => {
        const mnt = new Date().toLocaleString("en-US", { month: "long" });
        setMonth(mnt);
        console.log(month);
    }, []);


  useEffect(() => {
    if (userId) {
      dispatch(fetchRooms(userId));
    }
  }, [dispatch, userId]);

    console.log(userName);

    return (
        <div className="report-container">
            <div className="report-header">
                <Row justify="space-between" align="middle" style={{ width: "100%" }}>
                    <Col>
                        <Title level={2}>

                            {t("report.title")}
                        </Title>
                    </Col>
                    <Space>
                        <Button className="dashboard-button" type="primary" onClick={() => navigate(DASHBOARD_PATH)}>Dashboard</Button>
                        <Col>
                            <Text>
                                {userName}
                            </Text>
                        </Col>
                    </Space>
                </Row>
                <Row justify="space-between" align="middle" style={{ width: "100%" }}>
                    <Col>
                     
                        <ReportDownloadButton />

                    </Col>
                    <Col>
                        <Tag
                            className="tag"
                            color="#dafff6 "
                            icon={<CalendarOutlined />}
                        >
                            {month}
                        </Tag>
                    </Col>
                </Row>
            </div>

            <div id="report-container">
                <Splitter>
                    <Splitter.Panel defaultSize="60%" resizable={false}>
                        <div className="report-tabs">
                            <Tabs
                                className="tab"
                                defaultActiveKey="1"
                                items={tabs}
                                tabBarStyle={{ color: "teal", fontWeight: "bold" }}
                            />
                        </div>
                    </Splitter.Panel>
                    <Splitter.Panel resizable={false} className="splitter">
                        <div className="devices-list">
                            <Title level={4}>{t("report.consumers")}</Title>
                        </div>
                    </Splitter.Panel>
                </Splitter>
                <div className="rooms-list">
                    <Flex gap="small" vertical>
                        {roomsArray.map((room) => room.name !== " " && (
                            <div>
                                <Text>{room.name}</Text>
                                <Progress
                                    percent={Math.round((Number(room.energy) / 1000) * 100)}
                                    showInfo={false}
                                    strokeColor={
                                        room.energy >= 1000
                                            ? "#C70039"
                                            : room.energy >= 500 && room.energy < 1000
                                                ? "#FFDE2B"
                                                : "green"
                                    }
                                />
                            </div>
                        ))}
                    </Flex>
                </div>

            </div>
        </div>
    )
}