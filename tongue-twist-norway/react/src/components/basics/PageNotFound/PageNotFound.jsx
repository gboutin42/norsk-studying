import { Link } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

export default function PageNotFound() {
    return <Box align='center'>
        <Typography variant='h1' align='center' gutterBottom>404 Page not found !</Typography>
        <Button variant='contained'
            component={Link}
            to="/manager/dashboard"
        >
            go back home
        </Button>
    </Box>
}