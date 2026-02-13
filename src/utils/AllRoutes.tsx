import Attendance from "../pages/Attendance";
import Home from "../pages/Home";
import { RootLayout } from "../pages/RootLayout";

export const routes=[{
    path:"/",
    element:<RootLayout />,
    children:[
        {
            index:true,
            element:<Home />
        },
         {
            path:"attendance",
            element:<Attendance />
        },

    ]
}]