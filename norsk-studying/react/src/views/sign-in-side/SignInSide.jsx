import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import axiosClient from '../../axios';

export default function SignInSide() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [remember, setRemember] = useState(false)
    const [errors, setErrors] = useState([])
    const [errorMessage, setErrorMessage] = useState(null)

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(null)
        setErrorMessage(null)

        axiosClient.post('/login', {
            email,
            password,
            remember
        }).then(({ data }) => {
            console.log(data)
        }).catch(error => {
            console.log(error)
            if (error.response)
                setErrors(error.response.data.errors)
            if (error.response?.data?.error === "The provided credentials are not correct") {
                console.log("on rentre")
                setErrorMessage(error.response?.data?.error)
            }
        })
    };

    return (
        <>
            <Typography component="h1" variant="h5">
                Se connecter
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Adresse mail"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={ev => setEmail(ev.target.value)}
                    error={errors && errors.email}
                    helperText={(errors && errors.email) ? errors.email[0] : null}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Mot de passe"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={ev => setPassword(ev.target.value)}
                    error={errors && errors.password}
                    helperText={(errors && errors.password) ? errors.password[0] : null}
                />
                <FormControlLabel
                    control={<Checkbox value={remember} color="primary" onChange={ev => setRemember(ev.target.checked)} />}
                    label="Se souvenir de moi"

                />
                {
                    errorMessage && <Box>
                        <Typography color="error">
                            {errorMessage}
                        </Typography>
                    </Box>
                }
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Se connecter
                </Button>
                <Grid container>
                    <Grid item xs>
                        <Link href="#" variant="body2">
                            Mot de passe oublié?
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href="/signup" variant="body2">
                            {"Pas encore de compte?"}
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}