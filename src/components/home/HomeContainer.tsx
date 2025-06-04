import { Button, Space, DatePicker, version, Card, Typography, Form} from 'antd';
import "./home.css"
import {  useNavigate } from 'react-router-dom';
import { LOGIN_PATH } from '../../constants/RoutePaths';
import { SIGNUP_PATH } from '../../constants/RoutePaths';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph, Text } = Typography;

export const HomeContainer = () => {

  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div >
      <Card  
          className="innerBox"
          variant='outlined'
          title={<Title level={2} className='main-title'>{t("home.mainTitle")}</Title>}
      >
        <Title level={3} className='home-section'>{t("home.homeTitle")}</Title>
        <Paragraph className='cardtext'>
          {t("home.mainParagraph")}
        </Paragraph>
        
        <div className='wordBoxes'>
          <span className='emojis'>⚡</span>          
          <div>          
            <Title level={4}>{t("home.firstTitle")}</Title>
            <Paragraph className='cardtext'>
              {t("home.firstParagraph")}
            </Paragraph>
          </div>
        </div>

        <div className='wordBoxes'>
          <span className='emojis'>📊</span>          
          <div>          
            <Title level={4}>{t("home.secondTitle")}</Title>
            <Paragraph className='cardtext'>
              {t("home.secondParagraph")}
            </Paragraph>
          </div>
        </div>
        <div className='wordBoxes'>
          <span className='emojis'>🔄</span>          
          <div>          
            <Title level={4}>{t("home.thirdTitle")}</Title>
            <Paragraph className='cardtext'> 
              {t("home.thirdParagraph")}
            </Paragraph>
          </div>
        </div>

        <div className='buttons'>
          <Button className='loginButton' onClick={() => navigate(LOGIN_PATH)}>{t("home.loginButton")}</Button>
          <Button className='registrationButton' onClick={() => navigate(SIGNUP_PATH)}> {t("home.signupButton")}</Button>
          <Button className='tryButton'>{t("home.tryButton")}</Button>
        </div>
      </Card>
    </div>
);
};
