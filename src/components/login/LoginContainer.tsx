import { Input, Button, Form, Typography, Row, Col, Card} from 'antd';

const { Title } = Typography;

export const LoginContainer = () => {
    return (
        <div>
        <Card 
            variant='outlined'
            style={{width: 400, 
                    margin: '0 auto', 
                    marginTop: 100, 
                    borderRadius: 12, 
                    backgroundColor: "#B3FFCC", 
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
        >
            <Title level={2} style={{ textAlign: 'left' }}>Energy Emulator</Title>
            <Title level={3} style={{ textAlign: 'center' }}>Login</Title>
            <Form 
                name="login"
                layout="vertical"
            >
                <Form.Item 
                    label="Username"
                    name="username"
                    rules={[{required: true, message: "Enter your username"}]}
                >
                    <Input placeholder='myUsername' />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{required: true, message: "Enter your password"}]}
                >
                    <Input type="password" placeholder='myPassword' />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Log In
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Row gutter={8}>
                        <Col span={8}>
                        <Button block>
                            Home
                        </Button>
                        </Col>
                        <Col span={8}>
                        <Button type="default" block>
                            Try it
                        </Button>
                        </Col>
                        <Col span={8}>
                        <Button type="default" block>
                            Sign up
                        </Button>
                        </Col>
                    </Row>
                </Form.Item>

            </Form>
        </Card>
    </div>
    )
}