import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";

type SignInModalProps = {
  open: boolean;
  handleClose: () => void;
};

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignInModal({ open, handleClose }: SignInModalProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "12px", // Arrondit les bords avec une valeur de 12px
            width: "25%", // Agrandit la largeur de la modal à 25% de la largeur de l'écran
            height: "auto", // Ajuste la hauteur automatiquement en fonction du contenu
            maxWidth: "none", // Supprime la limite de largeur maximale si nécessaire
            bgcolor: "black", // Fond noir
            color: "white", // Texte en blanc
            borderColor: "white", // Contours en blanc
            borderWidth: 2,
            borderStyle: "solid",
          },
        }}
      >
        <CssBaseline />
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={2}
          sx={{ padding: 6 }}
        >
          <Grid item>
            <Avatar sx={{ bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
          </Grid>
          <Grid item>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
          </Grid>
          <Grid
            item
            container
            spacing={2}
            direction="column"
            alignItems="center"
            sx={{ width: "auto" }}
          >
            <Grid item>
              <TextField
                margin="normal"
                required
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                sx={{ width: "100%", mb: 2, color: "white", backgroundColor: "black" }} // Applique seulement la couleur du texte en blanc
                InputLabelProps={{
                  style: { color: "white" }, // Couleur du label en blanc
                }}
                InputProps={{
                  style: { color: "white", backgroundColor: "black" }, // Couleur du texte tapé en blanc
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                margin="normal"
                required
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                sx={{ width: "100%", mb: 2, color: "white" }} // Applique seulement la couleur du texte en blanc
                InputLabelProps={{
                  style: { color: "white" }, // Couleur du label en blanc
                }}
                InputProps={{
                  style: { color: "white" }, // Couleur du texte tapé en blanc
                }}
              />
            </Grid>
            <Grid item>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
            </Grid>
            <Grid item>
              <Button type="submit" variant="contained">
                Sign In
              </Button>
            </Grid>
            <Grid
              item
              container
              justifyContent="space-between"
              sx={{ width: "75%" }}
            >
              <Grid item>
                <Link href="#" variant="body2">
                  Forgot password
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
    </ThemeProvider>
  );
}
