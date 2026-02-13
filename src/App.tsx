import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./utils/AllRoutes";

function App() {
  const route=createBrowserRouter(routes)
  return <RouterProvider router={route} /> ;
}

export default App;
