import { Navigate, Outlet } from "react-router-dom";
import userAuthStore from "../stores/authstore";

export default function ProtectedRoute() {
    const token = userAuthStore((state) => state.token);
    // console.log("Token:",token);

    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />
}

