import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Alert, Box } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
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

      const {token , userId} = response.data;

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
          <Avatar sx={{ color: "white", bgcolor: "black" }}>
            <LockOutlinedIcon />
          </Avatar>
        </Grid>
        <Grid item>{error && <Alert severity="error">{error}</Alert>}</Grid>
        <Grid
          item
          container
          spacing={2}
          direction="column"
          alignItems="center"
          sx={{ width: "auto" }}
        >
          <Box
            component="form"
            justifyContent={"center"}
            noValidate
            onSubmit={handleSubmit}
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
                width: "100%",
                mb: 2,
                ".MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white", // Définit la couleur initiale de la bordure
                  },
                  "&:hover fieldset": {
                    borderColor: "white", // Maintient la couleur de la bordure au survol
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white", // Bordure en blanc lors du focus
                  },
                },
                ".MuiInputLabel-root": {
                  // Couleur du label
                  color: "white",
                },
                ".MuiInputBase-input": {
                  // Couleur du texte tapé
                  color: "white",
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
                  width: "100%",
                  mb: 2,
                  ".MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white", // Définit la couleur initiale de la bordure
                    },
                    "&:hover fieldset": {
                      borderColor: "white", // Maintient la couleur de la bordure au survol
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white", // Bordure en blanc lors du focus
                    },
                  },
                  ".MuiInputLabel-root": {
                    // Couleur du label
                    color: "white",
                  },
                  ".MuiInputBase-input": {
                    // Couleur du texte tapé
                    color: "white",
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
              <CustomButton
                type="submit"
                variant="contained"
              >
                Sign In
              </CustomButton>
            </Grid>
          </Box>
          <Grid
            item
            container
            justifyContent="space-between"
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
