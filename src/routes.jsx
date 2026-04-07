import { createBrowserRouter } from "react-router";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/home/Home";
import Contests from "./pages/Contests/Contests";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./Private/PrivateRoutes";

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
        path: "/all-contests",
        element: <Contests></Contests>,
      },

      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/sign-up",
        element: <Signup></Signup>,
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <Dashboard></Dashboard>
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
