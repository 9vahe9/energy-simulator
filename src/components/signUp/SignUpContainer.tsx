import { Input, Button, Form, Typography, Row, Col, Card} from 'antd';
import { useState } from 'react';
import './signUp.css';
import { auth } from '../../firebaseConfig/firebase';
import { useNavigate } from 'react-router-dom';
import { DASHBOARD_PATH, LOGIN_PATH, HOME_PATH } from '../../constants/RoutePaths';
import { createUserWithEmailAndPassword } from "firebase/auth"
const { Title } = Typography;

function SignUpContainer(){
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 


  async function handleSignUp(){

        try{
            const userSignUpAttempt = await createUserWithEmailAndPassword(auth, email, password);
            alert("Everything works fine");
        }
        
        catch(err) {
            alert("something went wrong");
        }

    }

   

    return (
        <div>
        <Card 
            className='login-card'
            variant='outlined'
        >
            <Title level={2} className="main-title" >Energy Emulator</Title>
            <Title level={3} className="login-title" >Sign Up </Title> 
            <Form 
                name="login"
                layout="vertical"
            >
                <Form.Item 
                    label="Username"
                    name="username"
                    rules={[{required: true, message: "Enter your username"}]}
                >
                    <Input placeholder='Enter your Email' value ={email} 
                    onChange={(e) => setEmail(e.target.value)}/>
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{required: true, message: "Enter your password"}]}
                >
                    <Input type="password" placeholder='myPassword' value={password}
                    onChange={(e) => setPassword(e.target.value)}/>
                </Form.Item>
                <Form.Item className='login-button-form'>
                    <Button className='login-button' type="primary" htmlType="submit" size='large' onClick={handleSignUp}>
                        Create An Account
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Row gutter={8}>
                        <Col span={8}>
                        <Button onClick={() => navigate(HOME_PATH)} type='link' block>
                            Back to Home
                        </Button>
                        </Col>
                        <Col span={8}>
                        <Button type='link' block>
                            Try without auth.
                        </Button>
                        </Col>
                        <Col span={8}>
                        <Button onClick={() => navigate(LOGIN_PATH)} type='link' block>
                            Log In
                        </Button>
                        </Col>
                    </Row>
                </Form.Item>

            </Form>
        </Card>
    </div>
    )


}



export default SignUpContainer