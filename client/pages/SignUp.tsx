import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import * as React from 'react';

// Personnalisation du bouton
const CustomButton = styled(Button)({
    backgroundColor: 'black', // Couleur de fond initiale
    color: 'white', // Couleur du texte initial
    '&:hover': {
        backgroundColor: 'grey', // Couleur de fond au survol
    },
});

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme({
    components: {
        MuiTextField: {
            defaultProps: {
                InputLabelProps: {
                    style: { color: 'white' },
                },
                InputProps: {
                    style: { color: 'white', borderColor: 'white' },
                },
            },
            styleOverrides: {
                root: {
                    '& label.Mui-focused': {
                        color: 'white',
                    },
                    '& .MuiInput-underline:after': {
                        borderBottomColor: 'white',
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'white',
                        },
                        '&:hover fieldset': {
                            borderColor: 'white',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'white',
                        },
                    },
                },
            },
        },
    },
    palette: {
        background: {
            default: 'black', // Définit le fond global en noir
        },
    },
});

export default function SignUp() {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs" >
                <CssBaseline />
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    spacing={2}
                    sx={{ padding: 6, minHeight: '100vh' }}
                >

                    <Grid container direction="row" alignItems="center" justifyContent="center" spacing={2}>
                        <Grid item>
                            <Typography component="h1" variant="h5" color="white">
                                Register
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Avatar sx={{ bgcolor: "black" }}>
                                <AppRegistrationIcon sx={{ color: "white", fontSize: 40 }} />
                            </Avatar>
                        </Grid>
                    </Grid>
                    <Box component="form" justifyContent={"center"} noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={5}>
                            <Grid item xs={15}>
                                <TextField
                                    autoComplete="username"
                                    name="Username"
                                    required
                                    fullWidth
                                    id="Username"
                                    label="Username"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={15}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={15}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                />
                            </Grid>
                        </Grid>
                        <CustomButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </CustomButton>
                    </Box>
                </Grid>
            </Container>
        </ThemeProvider>
    );
}
