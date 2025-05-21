import { Input, Button, Form, Typography, Row, Col, Card} from 'antd';
import { useState } from 'react';
import './login.css';
import { auth } from '../../firebaseConfig/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { DASHBOARD_PATH, SIGNUP_PATH, HOME_PATH } from '../../constants/RoutePaths';
import { useDispatch, useSelector } from 'react-redux';
import type {RootState} from "../../store/store"
import {setEmail, setPassword} from "../../store/authenticationSlice/Authslice"


const { Title } = Typography;

export const LoginContainer = () => {

    const email = useSelector((state: RootState) => state.auth.email);
    const password = useSelector((state: RootState )=> state.auth.password);
    const dispatch = useDispatch();

    const navigate = useNavigate();

   async function handleSignIn(){

        try{
            const signInAttempt = await signInWithEmailAndPassword(auth, email, password);
            dispatch(setEmail(""));
            dispatch(setPassword(""));
            navigate(DASHBOARD_PATH)
        }
        catch(err){
            alert("Sorry, check either your email or password");
        }
    }
    



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
                    <Input placeholder='myUsername' value ={email} 
                    onChange={(e) => dispatch(setEmail(e.target.value))}/>
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{required: true, message: "Enter your password"}]}
                >
                    <Input type="password" placeholder='myPassword' value={password}
                    onChange={(e) => dispatch(setPassword(e.target.value))}/>
                </Form.Item>
                <Form.Item className='login-button-form'>
                    <Button className='login-button' type="primary" htmlType="submit" size='large' onClick={handleSignIn}>
                        Log In
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Row gutter={8}>
                        <Col span={8}>
                        <Button onClick={() => navigate(HOME_PATH) } type='link' block>
                            Back to Home
                        </Button>
                        </Col>
                        <Col span={8}>
                        <Button type='link' block>
                            Try without auth.
                        </Button>
                        </Col>
                        <Col span={8}>
                        <Button onClick={() => navigate(SIGNUP_PATH)} type='link' block>
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