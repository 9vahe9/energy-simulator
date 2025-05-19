import { Input, Button, Form, Typography, Row, Col, Card} from 'antd';
import './login.css';

const { Title } = Typography;

export const LoginContainer = () => {
    return (
        <div>
        <Card 
            className='login-card'
            variant='outlined'
        >
            <Title level={2} className="main-title" >Energy Emulator</Title>
            <Title level={3} className="login-title" >Login</Title> 
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
                <Form.Item className='login-button-form'>
                    <Button className='login-button' type="primary" htmlType="submit" size='large'>
                        Log In
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Row gutter={8}>
                        <Col span={8}>
                        <Button type='link' block>
                            Back to Home
                        </Button>
                        </Col>
                        <Col span={8}>
                        <Button type='link' block>
                            Try without auth.
                        </Button>
                        </Col>
                        <Col span={8}>
                        <Button type='link' block>
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