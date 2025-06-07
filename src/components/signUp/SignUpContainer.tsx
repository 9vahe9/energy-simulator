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
import { createUserName, createRoom } from '../../store/user/userSlice';
import type { AppDispatch } from '../../store/store';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function SignUpContainer() {
    const navigate = useNavigate();
    const email = useSelector((state: RootState) => state.auth.email);
    const password = useSelector((state: RootState) => state.auth.password);
    const [userName, setUsername] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const { t, i18n } = useTranslation();

    console.log(i18n.language);
    console.log(t("signup.mainTitle"));

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
                <Title level={2} className="main-title" >{t("signup.mainTitle")}</Title>
                <Title level={3} className="login-title" >{t("signup.signupTitle")}</Title>
                <Form
                    name="login"
                    layout="vertical"
                >
                    <Form.Item
                        label={t("signup.email")}
                        name="email"
                        rules={[
                            { required: true, message: t("signup.emailMessage") },
                            { type: "email", message: t("signup.emailValidation")}
                        ]}
                    >
                        <Input placeholder='somemail@smt.com' value={email}
                            onChange={(e) => dispatch(setEmail(e.target.value))} />
                    </Form.Item>
                    <Form.Item
                        label={t("signup.password")}
                        name="password"
                        rules={[{ required: true, message: t("signup.passwordMessage") }]}
                    >
                        <Input type="password" placeholder='myPassword' value={password}
                            onChange={(e) => dispatch(setPassword(e.target.value))} />
                    </Form.Item>

                     <Form.Item
                        label={t("signup.username")}
                        name="userName"
                        rules={[{ required: true, message: t("signup.usernameMessage") }]}
                    >
                        <Input type="text" placeholder='someUsername' value={userName}
                            onChange={(e) => setUsername(e.target.value)} />
                    </Form.Item>


                    <Form.Item className='login-button-form'>
                        <Button className='login-button' type="primary" htmlType="submit" size='large' onClick={handleSignUp}>
                            {t("signup.signupButton")}
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Row gutter={8}>
                            <Col span={8}>
                                <Button onClick={() => navigate(HOME_PATH)} type='link' block>
                                    {t("signup.homeButton")}
                                </Button>
                            </Col>
                            <Col span={8}>
                                <Button type='link' block>
                                    {t("signup.TryButton")}
                                </Button>
                            </Col>
                            <Col span={8}>
                                <Button onClick={() => navigate(LOGIN_PATH)} type='link' block>
                                    {t("signup.loginButton")}
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