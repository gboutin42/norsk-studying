import { Breadcrumbs, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import menu from '../menu/menu.json';
import { useEffect, useState } from "react";
import { blue } from "@mui/material/colors";

export default function Breadcrumb(props) {
    const currentLocation = useLocation().pathname
    console.log(currentLocation)
    const [breadcrumbs, setBreadcrumbs] = useState([])

    useEffect(() => {
        menu.map(item => {
            switch (item.type) {
                case "item":
                    if (item.link && item.link === currentLocation)
                        setBreadcrumbs([item.title])
                    break;
                case "group":
                    item.children.map(child => {
                        if (child.link && child.link === currentLocation)
                            setBreadcrumbs([item.title, child.title])
                    })
                    break;
                default:
                    break;
            }
        })
    }, [])

    return breadcrumbs.length > 0 &&
        <Breadcrumbs aria-label="breadcrumb" sx={props.sx}>
            {breadcrumbs && breadcrumbs.map((title, pathIndex) => {
                return <Typography
                    sx={{
                        fontWeight: (pathIndex === breadcrumbs.length - 1) ? 500 : 900,
                        color: (pathIndex === breadcrumbs.length - 1) ? null : blue[700]
                    }}
                    key={title}
                >
                    {title}
                </Typography>
            })}
        </Breadcrumbs>
}