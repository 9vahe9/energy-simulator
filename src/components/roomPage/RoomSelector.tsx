import React, { useState } from "react";
import { Button, Select, Upload, message, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import useThreeScene from "../../hooks/useThreeScene.tsx";

const { Option } = Select;

const RoomSelectorApp = () => {
  const [selectedRoom, setSelectedRoom] = useState("emptyroom.glb");
  const [customRoomPath, setCustomRoomPath] = useState<string | null>(null);

  const {
    threeScene,
    rotateModelLeft,
    rotateModelRight,
    resetModelRotation,
    handleAddDevice,
  } = useThreeScene(customRoomPath || selectedRoom);

  const handleRoomChange = (value: string) => {
    setCustomRoomPath(null);
    setSelectedRoom(value);
  };

  return (
    <div style={{ padding: 20 }}>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Select
          value={customRoomPath ? "custom" : selectedRoom}
          onChange={handleRoomChange}
          style={{ width: 300 }}
        >
          <Option value="emptyroom.glb">🍳 Empty room</Option>
        </Select>

        <div style={{ border: "1px solid #ccc", borderRadius: 8 }}>
          {threeScene}
        </div>
      </Space>
    </div>
  );
};

export default RoomSelectorApp;
