import { Box } from "@mui/material";
import Header from "../../header/Header";
import { Outlet } from "react-router-dom";

function DefaultLayout() {
    return (
        <>
            <Header />
            <Box sx={{
                position: "absolute",
                top: "70px",
                display: "flex",
                flexDirection: "column",
                height: "calc(100% - 70px)",
                width: "100%",
            }}>
                <Box sx={{ display: "flex", flexDirection: "row", width: "inherit", height: "inherit", padding: "3% 5%" }}>
                    <Outlet />
                </Box>
            </Box>
        </>
    );
}

export default DefaultLayout;