import {
    createBrowserRouter,
    Navigate,
    RouterProvider
} from "react-router-dom";

import Login from "../pages/Login";
import Home from "../pages/Home";
import UserLayout from "../layouts/UserLayout";
import ProtectRoutes from "./ProtectedRoute";
import Wallet from "../pages/Wallet";

const router = createBrowserRouter([
    {
        element: <ProtectRoutes />,
        children: [
            {
                path: "/", Component: UserLayout,
                children: [
                    { index: true, Component: Home },
                    { path: "wallet", Component: Wallet }
                ]
            }
        ]
    },
    { path: "/login", Component: Login },
    { path: "*", element: <Navigate to="/" replace /> }
]);

export default function AppRouter() {
    return <RouterProvider router={router} />
}