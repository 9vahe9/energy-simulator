import "./dashboard.css"
import { Input, Button, Form, Typography, Row, Col, Card } from 'antd';
import type { RootState, AppDispatch } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../../store/authentication/authSlice";
import { useNavigate } from "react-router-dom";
import { HOME_PATH, ROOM_PATH } from "../../constants/RoutePaths";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig/firebase";
import { fetchRooms } from "../../store/user/userSlice";
import { useEffect } from "react";

export const DashboardContainer = () => {

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const userID = useSelector((state: RootState) => state.auth.userToken)
  const roomsArray = useSelector((state: RootState) => state.user.rooms);

  console.log(userID);

  useEffect(() => {
    if (userID) {
      dispatch(fetchRooms(userID));
    }
  }, [dispatch, userID])

  console.log(roomsArray);

  function handleLogOut() {
    signOut(auth)
      .then(() => {
        dispatch(setCurrentUser(null));
        sessionStorage.setItem("userToken", "");
        navigate(HOME_PATH);
        console.log(userID);
      })

  }


  console.log(roomsArray);
  return (

    <div>
      <div className="header">
        <div className="leftSide">
          <h1>Room Energy Management</h1>
          <Button onClick={() => navigate(ROOM_PATH)}> + Add New Room</Button>
          <Button>  Sort Rooms </Button>
        </div>


        <div className="rightSide">
          <div>
            <p>
              Total Energy Consumption
              <br />
              1,245 kWh
            </p>

            <p>
              Monthly Cost
              <br />
              $149.40
            </p>

          </div>

          <Input />

        </div>


      </div>

      <Button onClick={handleLogOut}>Logout</Button>
      {/* 
      {roomsArray.map((room) => (
        <>
          {room.name}
          <br />
          {room.description}
          <br />
          {room.energyConsumption}
          <br />
          {room.monthlyCost}
          <br />
          {room.levelOfEnergyConsumption}
          <br />
          <Button>Delete Room</Button>
          <br />
        </>
      ))} */}


    </div>

  );


};
