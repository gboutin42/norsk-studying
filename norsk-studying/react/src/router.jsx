import { Navigate, createBrowserRouter } from "react-router-dom";
import SignInSide from "./views/sign-in-side/SignInSide";
import SignUp from "./views/sign-up/SignUp";
import AuthLayout from "./components/layouts/auth/AuthLayout";
import DefaultLayout from "./components/layouts/default/DefaultLayout";
import Words from "./views/managing/words/Words";
import Users from "./views/managing/users/Users";
import Home from "./views/home/Home";
import Verbs from "./views/managing/verbs/Verbs";
import MainRevision from "./views/revisions/MainRevision";

const router = createBrowserRouter([
    {
        path: '/',
        element: <AuthLayout />,
        children: [
            {
                path: '/',
                element: <Navigate to="/login" />
            },
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
                path: '/home',
                element: <Home />
            },
            {
                path: '/revision',
                element: <MainRevision />
            },
            {
                path: '/manage',
                children: [
                    {
                        path: '/manage/words',
                        element: <Words />
                    },
                    {
                        path: '/manage/verbs',
                        element: <Verbs />
                    },
                    {
                        path: '/manage/users',
                        element: <Users />
                    }
                ]
            },
        ]
    }
])

export default router