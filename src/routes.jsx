import { createBrowserRouter } from "react-router";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/home/Home";
import Contests from "./pages/Contests/Contests";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import PrivateRoute from "./Private/PrivateRoutes";
import Leaderboard from "./pages/Leaderboard/Leaderboard";
import NotFound from "./pages/404/NotFound";
import ContestDetails from "./pages/Contests/ContestDetails";

import Dashboard from "./pages/Dashboard/Dashboard";
import ViewUsers from "./pages/Dashboard/ViewUsers";
import AdminRoutes from "./Private/AdminRoutes";

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
        path: "/leaderboard",
        element: <Leaderboard></Leaderboard>,
      },
      {
        path: "/contest-details/:id",
        element: (
          <PrivateRoute>
            <ContestDetails></ContestDetails>
          </PrivateRoute>
        ),
      },
      {
        path: "*",
        element: <NotFound></NotFound>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard></Dashboard>
      </PrivateRoute>
    ),
    children: [
      {
        path: "view-users",
        element: (
          <AdminRoutes>
            <ViewUsers></ViewUsers>
          </AdminRoutes>
        ),
      },
    ],
  },
]);

export default router;
