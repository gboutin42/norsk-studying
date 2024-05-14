import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useState } from 'react';
import { Collapse, IconButton, Link } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import menu from './menu.json';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { userStateContext } from '../../contexts/ContextProvider';

export default function CustomMenu() {
    const { currentUser } = userStateContext()
    const [open, setOpen] = useState(false)
    const [openCollapse, setOpenCollapse] = useState(false)
    const [currentOpenMenu, setCurrentOpenMenu] = useState(null)

    const toggleDrawer = (open, link) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        if (link !== null && link !== undefined)
            location.href = link
        setOpen(open);

    };
    const handleOpenCollapse = (key) => {
        const isOpen = openCollapse && key === currentOpenMenu
        setOpenCollapse(!isOpen)
        setCurrentOpenMenu(key)
    }

    const checkRight = (right) => {
        if (right === "admin")
            return currentUser.admin === 1
        return true
    }

    const list = () => (
        <Box role="presentation" >
            <List>
                {menu.map((item) => {
                    if (checkRight(item.right))
                        return <>
                            {item.type === "group"
                                ? <>
                                    <ListItemButton
                                        sx={{
                                            px: 2.5,
                                            width: "100%"
                                        }}
                                        onClick={() => handleOpenCollapse(item.title)}>
                                        <ListItemText primary={item.title} />
                                        {openCollapse && currentOpenMenu === item.title ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </ListItemButton>
                                    <Collapse in={openCollapse && currentOpenMenu === item.title} key={item.title}>
                                        {item.children.map(({ title, link, right }) => {
                                            if (checkRight(right))
                                                return (
                                                    <ListItemButton
                                                        component={Link}
                                                        to={link}
                                                        sx={{
                                                            px: 5,
                                                            width: "100%"
                                                        }}
                                                        onClick={toggleDrawer(false, link)}
                                                        onKeyDown={toggleDrawer(false, link)}
                                                    >
                                                        <ListItemText primary={title} />
                                                    </ListItemButton>
                                                )
                                        })}
                                    </Collapse>
                                </>
                                : <ListItem key={item.title} disablePadding>
                                    <ListItemButton
                                        component={Link}
                                        to={item.link}
                                        sx={{
                                            px: 2.5,
                                            width: "100%"
                                        }}
                                        onClick={toggleDrawer(false, item.link)}
                                        onKeyDown={toggleDrawer(false, item.link)}
                                    >
                                        <ListItemText primary={item.title} />
                                    </ListItemButton>
                                </ListItem>
                            }
                        </>
                }
                )}
            </List>
        </Box >
    );

    return (
        <>
            <Button onClick={toggleDrawer(true)}>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                >
                    <MenuIcon sx={{ color: "#fff" }} />
                </IconButton>
            </Button>
            <SwipeableDrawer
                anchor="left"
                open={open}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                sx={{ top: "60px" }}
            >
                {list()}
            </SwipeableDrawer>
        </>
    );
}