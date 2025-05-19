import { createBrowserRouter } from "react-router-dom";

import { DASHBOARD_PATH, HOME_PATH, ROOM_PATH } from "../constants/RoutePaths";
import { ContentContainer } from "../components/ContentContainer";
import HomePage from "../pages/HomePage";
import DassboardPage from "../pages/DassboardPage";
import RoomPage from "../pages/RoomPage";
import { LoginContainer } from "../components/login/LoginContainer";


export const router = createBrowserRouter([
  {
    path: HOME_PATH,
    element: <ContentContainer />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: DASHBOARD_PATH,
        element: <DassboardPage />,
      },
      {
        path: ROOM_PATH,
        element: <RoomPage />,
      },
    ],
  },
  {
    path: LOGIN_PATH,
    element: <LoginContainer />
  }
]);
