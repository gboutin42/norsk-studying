import { createBrowserRouter } from "react-router-dom";
import SignInSide from "./views/sign-in-side/SignInSide";
import SignUp from "./views/sign-up/SignUp";
import AuthLayout from "./components/layouts/auth/AuthLayout";
import DefaultLayout from "./components/layouts/default/DefaultLayout";
import Dashboard from "./views/dashboard/Dashboard";

const router = createBrowserRouter([
    {
        path: '/',
        element: <AuthLayout />,
        children: [
            {
                path: '/login',
                element: <SignInSide />
            },
            {
                path: '/signup',
                element: <SignUp />
            },
        ]
    },
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/dashboard',
                element: <Dashboard />
            }
        ]
    }
])

export default router