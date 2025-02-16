import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/SignIn";
import Users from "./pages/Users";
import UserEdit, { userLoader } from "./pages/UserEdit";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/users",
    element: <Users />,
  },
  {
    path: "/users/:userId",
    element: <UserEdit />,
    loader: userLoader,
  },
]);

export default router;
