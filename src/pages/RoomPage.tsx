// import { Select } from "antd";
// import { DEVICE_SELECT_OPTONS } from "../constants/Devices";

// const RoomPage = () => {
//   return (
//     <div>
//       <div>
//         <h1> add new device</h1>
//         <Select placeholder="select a device">
//           {DEVICE_SELECT_OPTONS.map((device) => (
//             <Select.Option key={device.type} value={device.type}>
//               {device.label}
//             </Select.Option>
//           ))}
//         </Select>
//       </div>
//     </div>
//   );
// };

// export default RoomPage;
import React, { useState } from "react";
import {
  Layout,
  List,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
} from "antd";
import { DEVICE_SELECT_OPTONS } from "../constants/Devices.tsx";
import useThreeScene from "../hooks/useThreeScene.tsx";
import { DayTime } from "../constants/DayTime.ts"; //

const { Content, Sider } = Layout;
const { Option } = Select;

const RoomPage: React.FC = () => {
  const { threeScene, handleAddDevice } = useThreeScene();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [form] = Form.useForm();

  const showModal = (type: number) => {
    setSelectedType(type);
    setModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      // create  IRoomDevice obj
      const device = {
        type: selectedType!,
        name: values.name,
        power: values.power,
        uptime: values.uptime,
        workingDayTime: values.workingDayTime,
      };
      handleAddDevice(device);
      setModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Content className="kkkkkk" style={{ flex: 1 }}>
        {threeScene}
      </Content>
      <Sider width={400} style={{ background: "#fff", padding: 16 }}>
        <h3>Devices</h3>
        <List
          dataSource={DEVICE_SELECT_OPTONS}
          renderItem={(item) => (
            <List.Item>
              <Button type="primary" onClick={() => showModal(item.type)}>
                {item.icon} {item.label}
              </Button>
            </List.Item>
          )}
        />
      </Sider>

      <Modal
        title="add device"
        open={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Add"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ workingDayTime: DayTime.Day }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please enter device name" },
              { min: 3, message: "min 3 charachter" },
            ]}
          >
            <Input minLength={3} maxLength={15} />
          </Form.Item>

          <Form.Item
            name="power"
            label="Power"
            rules={[{ required: true, message: "Please enter device power" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="uptime"
            label="Uptime (minute)"
            rules={[{ required: true, message: "please enter uptime " }]}
          >
            <InputNumber min={0} max={1440} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="workingDayTime"
            label="Working on Day"
            rules={[{ required: true, message: "please choose time on day" }]}
          >
            <Select>
              <Option value={DayTime.Day}>Day</Option>
              <Option value={DayTime.Night}>Night</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};
// import RoomContainer from "../components/roomPage/RoomContainer";

// const RoomPage = () => {
//     return <RoomContainer />
// };

export default RoomPage;
