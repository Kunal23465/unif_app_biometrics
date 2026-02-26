import Attendance from "../pages/Attendance";
import Home from "../pages/Home";
import LoginPage from "../pages/auth/LoginPage";
import { RootLayout } from "../pages/RootLayout";
import EnterOtpPage from "../pages/auth/EnterOtpPage";

export const routes = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: "enter-opt",
        element: <EnterOtpPage />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "attendance",
        element: <Attendance />,
      },
    ],
  },
];
