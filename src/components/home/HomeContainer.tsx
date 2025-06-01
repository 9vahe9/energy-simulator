import { Button, Space, DatePicker, version, Card, Typography, Form} from 'antd';
import "./home.css"
import {  useNavigate } from 'react-router-dom';
import { LOGIN_PATH } from '../../constants/RoutePaths';
import { SIGNUP_PATH } from '../../constants/RoutePaths';

const { Title, Paragraph, Text } = Typography;

export const HomeContainer = () => {

  const navigate = useNavigate();


  return (
    <div >
      <Card  
          className="innerBox"
          variant='outlined'
          title={<Title level={2} className='main-title'>Energy Emulator</Title>}
      >
        <Title level={3} className='home-section'> Simulate & control Systems</Title>
        <Paragraph className='cardtext'>
          Experience the future of energy management with our advanced emulation platform. Create your own smart home and optimize energy consumption in real-time.
        </Paragraph>
        
        <div className='wordBoxes'>
          <span className='emojis'>⚡</span>          
          <div>          
            <Title level={4}>Smart Room Configuration</Title>
            <Paragraph className='cardtext'>
                Design your own room layout with appliances and monitor their energy usage.
            </Paragraph>
          </div>
        </div>

        <div className='wordBoxes'>
          <span className='emojis'>📊</span>          
          <div>          
            <Title level={4}>Advanced Analytics</Title>
            <Paragraph className='cardtext'>
              Track efficiency, output, and performance metrics with our comprehensive dashboard.
            </Paragraph>
          </div>
        </div>
        <div className='wordBoxes'>
          <span className='emojis'>🔄</span>          
          <div>          
            <Title level={4}>Energy Optimization</Title>
            <Paragraph className='cardtext'> 
              Get recommendations to reduce energy consumption and save costs.
            </Paragraph>
          </div>
        </div>

        <div className='buttons'>
          <Button className='loginButton' onClick={() => navigate(LOGIN_PATH)}> Login </Button>
          <Button className='registrationButton' onClick={() => navigate(SIGNUP_PATH)}> Registration</Button>
          <Button className='tryButton'> Try it now </Button>
        </div>
      </Card>
    </div>
);
};
