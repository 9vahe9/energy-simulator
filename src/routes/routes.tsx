import { createBrowserRouter } from "react-router-dom";

import {
  DASHBOARD_PATH,
  HOME_PATH,
  ROOM_PATH,
  LOGIN_PATH,
  SIGNUP_PATH,
} from "../constants/RoutePaths";
import { ContentContainer } from "../components/ContentContainer";
import HomePage from "../pages/HomePage";
import DassboardPage from "../pages/DashBoardPage";
import RoomPage from "../pages/RoomPage";
import { LoginContainer } from "../components/login/LoginContainer";
import SignUpContainer from "../components/signUp/SignUpContainer";
import ProtectedRoutes from "../components/protected_routes/ProtectedRoutes";

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
        element: (
          <ProtectedRoutes>
            <DassboardPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: ROOM_PATH,
        element: (
          <ProtectedRoutes>
            <RoomPage />
          </ProtectedRoutes>
        ),
      },
    ],
  },
  {
    path: LOGIN_PATH,
    element: <LoginContainer />,
  },
  {
    path: SIGNUP_PATH,
    element: <SignUpContainer />,
  }
]);
