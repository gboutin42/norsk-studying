import { Box } from "@mui/material";
import Copyright from "../copyright/copyright";
import { blue, grey } from "@mui/material/colors";

export default function Footer(props) {
    return <Box
        display={"flex"}
        height={50}
        width={"100%"}
        bottom={0}
        position="absolute"
        boxShadow={12}
        borderTop={1}
        borderColor={grey[300]}
        alignItems={"center"}
        justifyContent={"center"}
        alignContent={"center"}
    >
        <Copyright />
    </Box>
}