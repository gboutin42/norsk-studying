import { Box, Button, Typography } from "@mui/material";
import router from "../../router";

export default function PageNotFound() {
    return <>
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)"
        }}>
            <Typography variant={"h3"}>404 page not found !</Typography>
            <Typography variant={"h3"}>Sorry, this page is going to climb !</Typography>
            <Button
                sx={{ mt: 2 }}
                variant="contained"
                onClick={() => router.navigate("/revisions")}
            >
                Revenir en lieu sur
            </Button>
        </Box>
    </>
}