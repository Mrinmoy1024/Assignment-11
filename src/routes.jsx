import { createBrowserRouter } from "react-router";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/home/Home";
import Contests from "./pages/Contests/Contests";
import Login from "./pages/login/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path: "/contests",
        element: <Contests></Contests>,
      },

      {
        path: "/login",
        element: <Login></Login>,
      },
    ],
  },
]);

export default router;
