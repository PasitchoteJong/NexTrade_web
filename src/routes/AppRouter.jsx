import {
    createBrowserRouter, Navigate, RouterProvider
} from "react-router-dom";

import Login from "../pages/Login";
import Home from "../pages/Home";
import UserLayout from "../layouts/UserLayout";

const router = createBrowserRouter([
    {
        path: "/",
        Component: UserLayout,
        children: [
            { index: true, Component: Home, },
        ],
    },
    { path: "/login", Component: Login },
    { path: "*", element: <Navigate to="/" replace /> },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />
}