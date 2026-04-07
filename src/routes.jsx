import { createBrowserRouter } from "react-router";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/home/Home";
import Contests from "./pages/Contests/Contests";

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
        index: "/contests",
        element: <Contests></Contests>,
      },
    ],
  },
]);

export default router;
