import { Input, Button, Form, Typography, Row, Col, Card } from 'antd';
import './login.css';
import { auth } from '../../firebaseConfig/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { DASHBOARD_PATH, SIGNUP_PATH, HOME_PATH } from '../../constants/RoutePaths';
//import { useDispatch, useSelector } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from "../../store/store"
import { setEmail, setPassword, setCurrentUser } from "../../store/authentication/authSlice"
import { useTranslation } from 'react-i18next';


const { Title } = Typography;

export const LoginContainer = () => {

    const { t } = useTranslation();
    const email = useSelector((state: RootState) => state.auth.email);
    const password = useSelector((state: RootState) => state.auth.password);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    async function handleSignIn() {

        try {


            const signInAttempt = await signInWithEmailAndPassword(auth, email, password);
            dispatch(setEmail(""));
            dispatch(setPassword(""));
            sessionStorage.setItem("userToken", signInAttempt.user.uid )
            dispatch(setCurrentUser(sessionStorage.getItem('userToken')));
            console.log(signInAttempt.user.uid);

            navigate(DASHBOARD_PATH)

        }
        catch (err) {
            alert(t("login.alert"));
        }

    }




    return (
        <div>
            <Card
                className='login-card'
                variant='outlined'
            >
                <Title level={2} className="main-title" >{t("login.mainTitle")}</Title>
                <Title level={3} className="login-title" >{t("login.loginTitle")}</Title>
                <Form
                    name="login"
                    layout="vertical"
                >
                    <Form.Item
                        label={t("login.email")}
                        name="email"
                        rules={[
                                { required: true, message: t("login.emailMessage") },
                                {type: "email", message: t("login.emailValidation")}
                            ]}
                    >
                        <Input placeholder='somemail@smt.com' value={email}
                            onChange={(e) => dispatch(setEmail(e.target.value))} />
                    </Form.Item>
                    <Form.Item
                        label={t("login.password")}
                        name="password"
                        rules={[{ required: true, message: t("login.passwordMessage") }]}
                    >
                        <Input type="password" placeholder='myPassword' value={password}
                            onChange={(e) => dispatch(setPassword(e.target.value))} />
                    </Form.Item>
                    <Form.Item className='login-button-form'>
                        <Button className='login-button' type="primary" htmlType="submit" size='large' onClick={handleSignIn}>
                            {t("login.loginButton")}
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Row gutter={8}>
                            <Col span={8}>
                                <Button onClick={() => navigate(HOME_PATH)} type='link' block>
                                    {t("login.homeButton")}
                                </Button>
                            </Col>
                            <Col span={8}>
                                <Button type='link' block>
                                    {t("login.TryButton")}
                                </Button>
                            </Col>
                            <Col span={8}>
                                <Button onClick={() => navigate(SIGNUP_PATH)} type='link' block>
                                    {t("login.signupButton")}
                                </Button>
                            </Col>
                        </Row>
                    </Form.Item>

                </Form>
            </Card>
        </div>
    )
}