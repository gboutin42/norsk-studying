import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import SignInSide from "./components/sign-in-side/SignInSide";
import SignUp from "./components/sign-up/SignUp";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />
    },
    {
        path: '/login',
        element: <SignInSide />
    },
    {
        path: '/signup',
        element: <SignUp />
    },
])

export default router