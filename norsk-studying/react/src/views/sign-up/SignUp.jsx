import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axiosClient from '../../axios';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export default function SignUp() {
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [errors, setErrors] = useState([])

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(null);

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
            if (error.response)
                setErrors(error.response.data.errors)
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
                            error={errors && errors.first_name}
                            helperText={(errors && errors.first_name) ? errors.first_name[0] : null}
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
                            error={errors && errors.last_name}
                            helperText={(errors && errors.last_name) ? errors.last_name[0] : null}
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
                            error={errors && errors.email}
                            helperText={(errors && errors.email) ? errors.email[0] : null}
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
                            error={
                                errors
                                && errors.password
                                && errors.password.filter((value) => value !== "The password field confirmation does not match.").length > 0
                            }
                            helperText={(
                                errors
                                && errors.password
                                && errors.password.filter((value) => value !== "The password field confirmation does not match.").length > 0
                            )
                                ? errors.password.filter((value) => value  !== "The password field confirmation does not match.")[0]
                                : null
                            }
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
                            error={
                                errors
                                && errors.password
                                && errors.password.filter((value) => value  === "The password field confirmation does not match.").length > 0
                            }
                            helperText={(
                                errors
                                && errors.password
                                && errors.password.filter((value) => value  === "The password field confirmation does not match.").length > 0
                            )
                                ? errors.password.filter((value) => value  === "The password field confirmation does not match.")[0]
                                : null
                            }
                        />
                    </Grid>
                </Grid>
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