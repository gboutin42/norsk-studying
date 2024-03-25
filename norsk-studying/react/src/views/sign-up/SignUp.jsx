import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axiosClient from '../../axios';
import { red } from '@mui/material/colors';

export default function SignUp() {
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [error, setError] = useState(null)

    const handleSubmit = (event) => {
        event.preventDefault();
        setError(null);

        axiosClient.post(
            '/signup', {
            first_name: firstname,
            last_name: lastname,
            email,
            password,
            password_confirmation: passwordConfirmation
        }
        ).then(({ data }) => {
            console.log(data)
        }).catch((error) => {
            if (error.response) {
                const errors = Object.values(error.response.data.errors).reduce((accu, next) => [...accu, ...next], [])
                const finalErrors = []
                errors.map(error => {
                    finalErrors.push(
                        <Typography color='#FFFFFF'>{error}</Typography>
                    )
                })
                setError(finalErrors)
            }
            console.error(error)
        })
    };

    return (
        <>
            <Typography component="h1" variant="h5">
                Créer un compte
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            autoComplete="given-name"
                            name="firstName"
                            required
                            fullWidth
                            id="firstName"
                            label="Prénom"
                            autoFocus
                            value={firstname}
                            onChange={ev => setFirstname(ev.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            id="lastName"
                            label="Nom"
                            name="lastName"
                            autoComplete="family-name"
                            value={lastname}
                            onChange={ev => setLastname(ev.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            label="Adresse mail"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={ev => setEmail(ev.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="password"
                            label="Mot de passe"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={ev => setPassword(ev.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="password_confirmation"
                            label="Confirmer votre mot de passe"
                            type="password"
                            id="password-confirmation"
                            value={passwordConfirmation}
                            onChange={ev => setPasswordConfirmation(ev.target.value)}
                        />
                    </Grid>
                </Grid>
                {error && <Box bgcolor={red[400]} borderRadius={1} mt={2} p={2}>
                    {error}
                </Box>}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Créer un compte
                </Button>
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Link href="/login" variant="body2">
                            Vous avez déjà un compte?
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}