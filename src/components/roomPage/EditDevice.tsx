
import { Modal, Form, Input, InputNumber, Select, Button } from "antd"
import type { IRoomDevice } from "../../types/device"


const EditDevice = (device: IRoomDevice,
    onSaveFunction: (updatedDevice: IRoomDevice) => void,
    deleteDeviceFunction: (deviceId: number) => void
) => {

    const tempDevice = { ...device }
    return (
    Modal.confirm({
        title: `Edit device ${tempDevice.name}`,
        icon: null,
        okText: "Save",
        cancelText: "Cancel",
        centered: true,
        closable: true,
        width: 600,
        content: (
            <Form
                layout="vertical"
                initialValues={{
                    name: device.name,
                    power: device.power,
                    uptime: device.uptime,
                    workingDayTime: device.workingDayTime,
                }}

                onValuesChange={(changedValues, allValues) => {
                    Object.assign(tempDevice, allValues);
                }}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Power (W)"
                    name="power"
                    rules={[{ required: true }]}>

                    <InputNumber style={{ width: "100%" }} />

                </Form.Item>

                <Form.Item
                    label="Up Time (Minutes)"
                    name="uptime"
                    rules={[{ required: true }]}>

                    <InputNumber min={0} max={1440} style={{ width: "100%" }} />

                </Form.Item>

                <Form.Item
                    label="Working day time"
                    name="workingDayTime"
                    rules={[{ required: true }]}
                >
                    <Select>
                        <Select.Option value="Day">Day</Select.Option>
                        <Select.Option value="Night">Night</Select.Option>
                    </Select>

                </Form.Item>
            </Form>

        ),
        okButtonProps: {
             style: { backgroundColor: "#1890ff", color: "white" },
        },

        onOk(){
            onSaveFunction(tempDevice);
        },

        footer:(_, {OkBtn, CancelBtn}) => (
            <>
                <Button danger onClick = {() =>deleteDeviceFunction(device.deviceId)}>
                    Delete
                </Button>
             <div style={{ marginLeft: "auto" }}>
          <CancelBtn />
          <OkBtn />
        </div>
            </>
        )


    }))

}



export default EditDevice


