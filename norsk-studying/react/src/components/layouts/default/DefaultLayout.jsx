import { Box } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import Header from "../../header/Header";
import { userStateContext } from "../../../contexts/ContextProvider";

function DefaultLayout() {
    const { currentUser, userToken} = userStateContext()

    if (!userToken)
        return <Navigate to='/login' />

    return (
        <>
            <Header />
            <Box sx={{
                my: 4,
                textAlign: 'center',
                width: '100%'
            }}>
                <Outlet />
            </Box>
            Footer Component
        </>
    );
}

export default DefaultLayout;