import { createBrowserRouter } from "react-router-dom";

import {
  DASHBOARD_PATH,
  HOME_PATH,
  ROOM_PATH,
  LOGIN_PATH,
  SIGNUP_PATH,
  REPORT_PATH,
} from "../constants/RoutePaths";

import HomePage from "../pages/HomePage";
import RoomPage from "../pages/RoomPage";
import { LoginContainer } from "../components/login/LoginContainer";
import SignUpContainer from "../components/signUp/SignUpContainer";
import DashboardPage from "../pages/DashboardPage";
import ProtectedRoutes from "../components/protected_routes/ProtectedRoutes";
import { AppLayout } from "../components/AppLayout";
import { ReportPage } from "../pages/ReportPage";

export const router = createBrowserRouter([
  {
    path: HOME_PATH,
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: DASHBOARD_PATH,
        element: (
          <ProtectedRoutes>
            <DashboardPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: `${ROOM_PATH}/:roomId?`, 
        element: (
          <ProtectedRoutes>
            <RoomPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: REPORT_PATH,
        element: (
          <ProtectedRoutes>
            <ReportPage/>
          </ProtectedRoutes>
      )
      },
      {
        path: LOGIN_PATH,
        element: <LoginContainer />
      },
      {
        path: SIGNUP_PATH,
        element: <SignUpContainer />
      },
      
    ],
  },
]);
