import { Box } from "@mui/material";
import Header from "../../header/Header";
import { Outlet } from "react-router-dom";

function DefaultLayout() {
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