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
import { doc, getDoc, setDoc } from "firebase/firestore";
import { dataBase } from "../../firebaseConfig/firebase";
import type { Room } from '../../store/user/userSlice';

function SignUpContainer() {
    const navigate = useNavigate();
    const email = useSelector((state: RootState) => state.auth.email);
    const password = useSelector((state: RootState) => state.auth.password);
    const dispatch = useDispatch();


    

    async function handleSignUp() {
        const rooms: Room[] =  [{
            name: "kitchen",
            description: "Place where people munch",
            levelOfEnergyConsumption: "green",
            monthlyCost: "1000usd",
            energyConsumption: "100watts",
            devices: [{name: "toaster", wattage: "15"}],
        }];
        try {
            const userSignUpAttempt = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(dataBase, "users", userSignUpAttempt.user.uid), {
                userRooms: rooms,
            })
            dispatch(setEmail(""));
            dispatch(setPassword(""));
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
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Enter your email" },
                            { type: "email", message: "Email is invalid"}
                        ]}
                    >
                        <Input placeholder='somemail@smt.com' value={email}
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