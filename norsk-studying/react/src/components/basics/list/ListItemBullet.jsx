import { Box, Grid, List, ListItem, ListItemText, Paper } from "@mui/material"

function ListItemBullet({ list = [] }) {
    return (
        <Grid container rowSpacing={1} columnSpacing={2}>
            {
                list.map(item => {
                    return <Grid item sm={12} md={6} lg={4}>
                        <Paper elevation={2} sx={{ opacity: 0.7, p: 1 }}>
                            {item}
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    )
}

export default ListItemBullet;