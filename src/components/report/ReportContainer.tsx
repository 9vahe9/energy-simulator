import { Row, Col, Typography, Button, Space, Tag, Tabs, Flex, Progress, Splitter, Divider } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import "./report.css"
import { fetchRooms } from "../../store/user/userSlice";
import type { AppDispatch } from "../../store/store";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DASHBOARD_PATH } from "../../constants/RoutePaths";
import { ReportDownloadButton } from "./ReportDownloadButton";
import type { IRoom } from "../../types/room";
import { DeviceType } from "../../constants/Devices";
import type { EnergyByDeviceType } from "../../types/energyByType";
import { EnergyGraph } from "./ReportTabs/EnergyGraph";
import { CostGraph } from "./ReportTabs/CostGraph";

const { Title, Text } = Typography;

export const ReportContainer = () => {
    const userName = useSelector((state: RootState) => state.user.userName);
    const userId = useSelector((state: RootState) => state.auth.userToken);
    const roomsArray = useSelector((state: RootState) => state.user.rooms);
    const [month, setMonth] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { t } = useTranslation();

    type EnergyLogPoint = {
        timestamp: string;
        totalEnergy: number;
    };

    const energyLogRef = useRef<EnergyLogPoint[]>([]);

    useEffect(() => {
        const calculateTotalEnergy = () => {
            return roomsArray.reduce((roomAcc, room) => {
                return roomAcc + room.devices.reduce((devAcc, dev) => {
                    return devAcc + (dev.power / 1000) * (dev.uptime / 60);
                }, 0);
            }, 0);
        };

        if (!roomsArray || roomsArray.length === 0) return;

        const storedLog = localStorage.getItem("energyLog");
        if (storedLog) {
            energyLogRef.current = JSON.parse(storedLog);
        }

        const currentEnergy = Number(calculateTotalEnergy().toFixed(2));
        if (currentEnergy === 0) return;

        const last = energyLogRef.current.at(-1)?.totalEnergy ?? 0;

        if (Math.abs(currentEnergy - last) > 0.01) {
            const newPoint = {
                timestamp: new Date().toISOString(),
                totalEnergy: currentEnergy,
            };

            energyLogRef.current.push(newPoint);
            localStorage.setItem("energyLog", JSON.stringify(energyLogRef.current));
        }
    }, [roomsArray]);

    const costLog = energyLogRef.current.map(p => ({
        timestamp: p.timestamp,
        totalCost: Number((p.totalEnergy * 0.2).toFixed(2)),
    }));



    const tabs = [
        {
            key: "1",
            label: t("report.tabs.day"),
            children: <EnergyGraph data={energyLogRef.current} />,
        },
        {
            key: "2",
            label: t("report.tabs.week"),
            children: <CostGraph data={costLog}/>,
        },
    ];

    const getTotalEnergyByDeviceType = (): EnergyByDeviceType => {
        const energyMap: EnergyByDeviceType = {};

        Object.keys(DeviceType)
            .filter((key) => isNaN(Number(key)))
            .forEach(type => {
                energyMap[type as keyof typeof DeviceType] = 0;
        });

        roomsArray.forEach(room => {
            room.devices.forEach(device => {
                const typeKey = DeviceType[device.type];
                const waste = (device.power / 1000) * (device.uptime / 60);
                energyMap[typeKey] = (energyMap[typeKey] || 0) + waste;
            })
        });

        const filtered = Object.fromEntries(
            Object.entries(energyMap).filter(([_, value]) => value > 0)
        );

        return filtered;
    }

    const filteredDevices = Object.entries(getTotalEnergyByDeviceType())
        .filter(([_, value]) => value > 0)
        .map(([type, energy]) => ({
            type,
            energy,
        })
    ).sort((d1, d2) => d2.energy - d1.energy).slice(0, 5);

    console.log(filteredDevices);

    const roomWaste = (room: IRoom) => {
        let waste = room.devices.reduce((acc, curr) => {
            const e = curr.power/1000 * curr.uptime/60;
            acc += e;
            return acc;
        }, 0);
        return waste;
    }

    const sortedRooms = [...roomsArray].sort((r1, r2) => roomWaste(r2) - roomWaste(r1));

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
                                tabBarStyle={{ fontWeight: "bold" }}
                            />
                        </div>
                    </Splitter.Panel>
                    <Splitter.Panel resizable={false} className="splitter">
                        <div className="devices-list">
                            <Title level={3}>{t("report.consumers")}</Title>
                            <Divider />
                            {filteredDevices.length === 0 ? t("report.empty") 
                                : filteredDevices.map((device) => (
                                    <div>
                                        <Flex justify="space-between" align="center">
                                            <Title level={4} style={{ margin: 0 }}>{device.type}</Title>
                                            <Text>{device.energy.toFixed(2)} kWt</Text>
                                        </Flex>
                                        <Progress 
                                            percent={Math.round((Number(device.energy) / 10) * 100)}
                                            showInfo={false}
                                            strokeColor={
                                                device.energy >= 7
                                                    ? "#C70039"
                                                    : device.energy >= 2 && device.energy < 7
                                                        ? "#FFDE2B"
                                                        : "green"
                                            }
                                        />
                                    </div>
                                ))}
                        </div>
                    </Splitter.Panel>
                </Splitter>
                <div className="rooms-list">
                    <Flex gap="small" vertical>
                        <Title level={3}>{t("report.rooms")}</Title>
                        <Divider />
                        {sortedRooms[0].id === " " ? t("report.empty") : sortedRooms.map((room) => room.name !== " " && (
                            <div>
                                <Flex justify="space-between" align="center">
                                    <Title level={4} style={{ margin: 0 }}>{room.name}</Title>
                                    <Text>{roomWaste(room).toFixed(2)}kWt</Text>
                                </Flex>
                                <Progress
                                    percent={Math.round((Number(roomWaste(room)) / 8) * 100)}
                                    showInfo={false}
                                    strokeColor={
                                        roomWaste(room) >= 5
                                            ? "#C70039"
                                            : roomWaste(room) >= 2 && roomWaste(room) < 5
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