import { Box } from "@mui/material";
import Header from "../../header/Header";
import { Outlet } from "react-router-dom";
import Breadcrumb from "../../breadcrumb/Breadcumb";
import Footer from "../../footer/Footer";

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
                <Breadcrumb sx={{ margin: "2% 5%" }} />
                <Box sx={{ display: "flex", flexDirection: "column", width: "inherit", height: "inherit", padding: "0 5% 2% 5%" }}>
                    <Outlet />
                </Box>
            </Box>
            <Footer />
        </>
    );
}

export default DefaultLayout;