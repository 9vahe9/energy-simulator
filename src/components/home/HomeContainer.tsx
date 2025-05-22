import { Button, Space, DatePicker, version } from 'antd';
import "./home.css"
import { Navigate, useNavigate } from 'react-router-dom';
import { LOGIN_PATH } from '../../constants/RoutePaths';
import { SIGNUP_PATH } from '../../constants/RoutePaths';

export const HomeContainer = () => {

  const navigate = useNavigate();


  return (
    <div className="innerBox">

      <h1>Energy Emulator</h1>
      <h2> Simulate & control Systems</h2>
      <p>
      Experience the future of energy management with our 
      <br />
      advanced emulation platform. Create your own smart
      <br />
      home and optimize energy consumption in real-time.
      </p>
      
      <br />
      
      <div className='wordBoxes'>
        <span>⚡</span>          
      <div>          
      <h3>Smart Room Configuration</h3>
      <p>Design your own room layout with appliances and 
        <br />
        monitor their energy usage.
      </p>
      </div>
      </div>
      <div className='wordBoxes'>
        <span>📊</span>          
      <div>          
      
      <h3>Advanced Analytics</h3>
      <p>Track efficiency, output, and performance metrics with
        <br />
        our comprehensive dashboard.
      </p>
      </div>
      </div>
      <div className='wordBoxes'>
        <span>🔄</span>          
      <div>          
      
      
      <h3>Energy Optimization</h3>
      <p> Get recommendations to reduce energy consumption
        <br />
        and save costs.
      </p>
      </div>
      </div>



      

    <div className='buttons'>

    <Button className='loginButton' onClick={() => navigate(LOGIN_PATH)}> Login </Button>
    <Button className='registrationButton' onClick={() => navigate(SIGNUP_PATH)}> Registration</Button>
    <Button className='tryButton'> Try it now </Button>
    
    </div>
    </div>
  
);
};
