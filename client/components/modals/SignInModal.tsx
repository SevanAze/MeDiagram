import { Avatar, Box, Button, CssBaseline, Dialog, Grid, Link, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from "axios";
import React, { useState } from "react";

type SignInModalProps = {
  open: boolean;
  handleClose: () => void;
};

const CustomButton = styled(Button)({
  backgroundColor: "black", // Couleur de fond initiale
  color: "white", // Couleur du texte initial
  "&:hover": {
    backgroundColor: "grey", // Couleur de fond au survol
    // La couleur du texte reste blanche, donc pas besoin de la redéfinir
  },
});

export default function SignInModal({ open, handleClose }: SignInModalProps) {
  const [error, setError] = useState(""); // To display error messages

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    try {
      const response = await axios.post(`/login`, {
        email,
        password,
      });

      const { token, userId } = response.data;

      if (response.status === 200 && token !== "") {
        // Store the token securely (e.g., using localStorage or encrypted cookies)
        localStorage.setItem("authToken", token);
        localStorage.setItem("userId", userId);
        // Redirect to the protected or authenticated area
        window.location.href = "/"; // Or your desired route
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      // Handle network errors or other unexpected issues
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: "12px", // Arrondit les bords avec une valeur de 12px
          width: "90%", // Ajuste la largeur de la modal à 90% de la largeur de l'écran
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
        sx={{ padding: 2 }} // Réduit l'espacement
      >
        <Grid item>
          <Avatar sx={{ color: "white", bgcolor: "black" }}>
            <LockOutlinedIcon />
          </Avatar>
        </Grid>
        <Grid item>{error && <Typography variant="body1" sx={{ color: 'red' }}>{error}</Typography>}</Grid>
        <Grid
          item
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={2}
          sx={{ width: "100%", color: "white", mt: 2 }}
        >
          <Box
            component="form"
            justifyContent={"center"}
            noValidate
            onSubmit={handleSubmit}
            sx={{ width: "100%", color: "white" }}
          >
            <Grid item sx={{ width: "100%", color: "white", borderColor: "white" }}>
              <TextField
                margin="normal"
                required
                fullWidth // Prend toute la largeur disponible
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                InputProps={{
                  style: { color: "white", borderColor: "white" }, 
                }}
                InputLabelProps={{
                  style: { color: "white", borderColor: "white" },
                }}
              />
            </Grid>
            <Grid item sx={{ width: "100%", color: "white", borderColor: "white"  }}>
              <TextField
                margin="normal"
                required
                fullWidth // Prend toute la largeur disponible
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                InputProps={{
                  style: { color: "white", borderColor: "white" }, 
                }}
                InputLabelProps={{
                  style: { color: "white", borderColor: "white" },
                }}
              />
            </Grid>
            <Grid item sx={{ width: "100%" }}>
              <CustomButton
                type="submit"
                variant="contained"
                fullWidth // Prend toute la largeur disponible
              >
                Sign In
              </CustomButton>
            </Grid>
          </Box>
          <Grid
            item
            container
            justifyContent="center"
            sx={{ width: "100%" }}
          >
            <Grid item>
              <Link href="/signup" variant="body2" sx={{ color: "powderblue" }}>
                {"Don't have an account ? Sign Up !"}
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
}
