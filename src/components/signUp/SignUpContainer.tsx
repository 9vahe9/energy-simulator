import { Input, Button, Form, Typography, Row, Col, Card } from 'antd';
import './signUp.css';
import { auth } from '../../firebaseConfig/firebase';
import { useNavigate } from 'react-router-dom';
import { LOGIN_PATH, HOME_PATH } from '../../constants/RoutePaths';
import { createUserWithEmailAndPassword } from "firebase/auth"
const { Title } = Typography;
import { setEmail, setPassword } from '../../store/authentication/authSlice';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
//import type { Room } from '../../store/user/userSlice';
import { createRoom, createUserName } from '../../store/user/userSlice';
import type { AppDispatch } from '../../store/store';
import { useState } from 'react';


function SignUpContainer() {
    const navigate = useNavigate();
    const email = useSelector((state: RootState) => state.auth.email);
    const password = useSelector((state: RootState) => state.auth.password);
    const [userName, setUsername] = useState("");
    const dispatch = useDispatch<AppDispatch>();




    async function handleSignUp() {

        try {
            const createAnAccount =  await createUserWithEmailAndPassword(auth, email, password);
            const id = createAnAccount.user.uid

      
            dispatch(createRoom(id));
            dispatch(setEmail(""));
            dispatch(setPassword(""));
            dispatch(createUserName({ userId: id, newName: userName }));
            alert("Everything works fine");
        }

        catch (err) {
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
                        rules={[{ required: true, message: "Enter your username" }]}
                    >
                        <Input placeholder='Enter your Email' value={email}
                            onChange={(e) => dispatch(setEmail(e.target.value))} />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Enter your password" }]}
                    >
                        <Input type="password" placeholder='myPassword' value={password}
                            onChange={(e) => dispatch(setPassword(e.target.value))} />
                    </Form.Item>

                     <Form.Item
                        label="userName"
                        name="userName"
                        rules={[{ required: true, message: "Enter your password" }]}
                    >
                        <Input type="text" placeholder='Enter your userName' value={userName}
                            onChange={(e) => setUsername(e.target.value)} />
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