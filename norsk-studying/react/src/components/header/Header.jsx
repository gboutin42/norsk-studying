import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import axiosClient from '../../axios';
import { userStateContext } from '../../contexts/ContextProvider';
import { Navigate } from "react-router-dom";
import CustomMenu from '../menu/CustomMenu';
import AbortControllerSignal from '../providers/AbortController';
import { useEffect, useState } from 'react';

function Header() {
    const { currentUser, userToken, setCurrentUser, setUserToken } = userStateContext()
    const [isClicked, setIsClicked] = useState(false)

    useEffect(() => {
        if (isClicked) AbortControllerSignal([getUser])
    }, [isClicked])

    if (!userToken)
        return <Navigate to='/login' />

    const [anchorEl, setAnchorEl] = useState(null);
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logout = (ev) => {
        ev.preventDefault()
        axiosClient.post('/logout')
            .then((res) => {
                setCurrentUser(null)
                setUserToken(null)
            })
    }

    const handleClick = (ev) => {
        console.log(currentUser)
        ev.preventDefault()
        if (!isClicked)
            setIsClicked(true)

        console.log('on click')
    }

    const getUser = (signal = null) => {
        axiosClient.get('users/show/' + currentUser.id, { signal: signal })
            .then((response) => {
                if (response.data.success && response.data.data) {
                    console.log('in if')
                } else {
                    console.log('in else')

                }
                setIsClicked(false)
            })
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <CustomMenu />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Norsk Revisjon
                    </Typography>
                    <>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-account"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClick}>My account</MenuItem>
                            <MenuItem onClick={logout}>Logout</MenuItem>
                        </Menu>
                    </>
                </Toolbar>
            </AppBar>
        </Box>
    );
}


export default Header;