import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../pages/dashboard/Dashboard";
import Login from "../features/auth/pages/Login";
import Home from "../pages/home/Home";
import PublicRoute from "./PublicRoute";
import Register from "../features/auth/pages/register/Register";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home></Home>
    },
    {
        path: "/login",
        element: <PublicRoute>
            <Login></Login>
        </PublicRoute>
    },
    {
        path: "/register",
        element: <PublicRoute>
            <Register></Register>
        </PublicRoute>
    },
    {
        path: "/dashboard",
        element: (
            <PrivateRoute>
                <Dashboard></Dashboard>
            </PrivateRoute>
        )
    }

])