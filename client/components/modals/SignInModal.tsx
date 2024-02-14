import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";

type SignInModalProps = {
  open: boolean;
  handleClose: () => void;
};

const CustomButton = styled(Button)({
  backgroundColor: 'black', // Couleur de fond initiale
  color: 'white', // Couleur du texte initial
  '&:hover': {
    backgroundColor: 'grey', // Couleur de fond au survol
    // La couleur du texte reste blanche, donc pas besoin de la redéfinir
  },
});

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
            <Avatar sx={{ bgcolor: "black" }}>
              <LockOutlinedIcon />
            </Avatar>
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
                sx={{
                  width: "100%", mb: 2,
                  '.MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'white', // Définit la couleur initiale de la bordure
                    },
                    '&:hover fieldset': {
                      borderColor: 'white', // Maintient la couleur de la bordure au survol
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white', // Bordure en blanc lors du focus
                    },
                  },
                  '.MuiInputLabel-root': { // Couleur du label
                    color: 'white',
                  },
                  '.MuiInputBase-input': { // Couleur du texte tapé
                    color: 'white',
                  },
                }} // Applique seulement la couleur du texte en blanc
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
                sx={{
                  width: "100%", mb: 2,
                  '.MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'white', // Définit la couleur initiale de la bordure
                    },
                    '&:hover fieldset': {
                      borderColor: 'white', // Maintient la couleur de la bordure au survol
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white', // Bordure en blanc lors du focus
                    },
                  },
                  '.MuiInputLabel-root': { // Couleur du label
                    color: 'white',
                  },
                  '.MuiInputBase-input': { // Couleur du texte tapé
                    color: 'white',
                  },
                }} // Applique seulement la couleur du texte en blanc
                InputLabelProps={{
                  style: { color: "white" }, // Couleur du label en blanc
                }}
                InputProps={{
                  style: { color: "white" }, // Couleur du texte tapé en blanc
                }}
              />
            </Grid>
            <Grid item>
              <CustomButton type="submit" variant="contained">
                Sign In
              </CustomButton>
          </Grid>
          <Grid
            item
            container
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            <Grid item>
              <Link href="#" variant="body2" sx={{ color: "powderblue" }}>
                {"Don't have an account ? Sign Up !"}
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
    </ThemeProvider >
  );
}
