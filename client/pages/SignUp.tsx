import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

// Personnalisation du bouton
const CustomButton = styled(Button)({
  backgroundColor: "black", // Couleur de fond initiale
  color: "white", // Couleur du texte initial
  "&:hover": {
    backgroundColor: "grey", // Couleur de fond au survol
  },
});

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        InputLabelProps: {
          style: { color: "white" },
        },
        InputProps: {
          style: { color: "white", borderColor: "white" },
        },
      },
      styleOverrides: {
        root: {
          "& label.Mui-focused": {
            color: "white",
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: "white",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "white",
            },
            "&:hover fieldset": {
              borderColor: "white",
            },
            "&.Mui-focused fieldset": {
              borderColor: "white",
            },
          },
        },
      },
    },
  },
  palette: {
    background: {
      default: "black", // Définit le fond global en noir
    },
  },
});

export default function SignUp() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [registerStatus, setRegisterStatus] = useState(false);

  const { verifyToken, isAuthenticated } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      await verifyToken();
    };
  
    checkAuth();
  }, [verifyToken]);

  const navigate = useNavigate();

  React.useEffect(() => {
    if(dialogMessage !== "Registration successfull !") setRegisterStatus(false)
    else setRegisterStatus(true)
  }, [dialogMessage])

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const username = data.get("username");
    const email = data.get("email");
    const password = data.get("password");

    // Vérification que aucun champ n'est vide
    if (!username || !email || !password) {
      setDialogMessage("All fields are required !");
      setDialogOpen(true);
      return;
    }

    if(isAuthenticated){
      setDialogMessage("You are already connected !");
      setDialogOpen(true);
      return;
    }

    try {
      await axios.post(`/register`, {
        username,
        email,
        password,
      });

      setDialogMessage("Registration successfull !");
      setDialogOpen(true);
    } catch (error: any) {
      console.log(error.response.data);
      if (error.response && error.response.data.includes("User duplication")) {
        setDialogMessage("Username or email are already taken.");
      } else {
        setDialogMessage("Error registering user.");
      }
      setDialogOpen(true);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    if(registerStatus) navigate('/')
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={2}
          sx={{ padding: 6, minHeight: "100vh" }}
        >
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={2}
          >
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
          <Box
            component="form"
            justifyContent={"center"}
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={5}>
              <Grid item xs={15}>
                <TextField
                  autoComplete="username"
                  name="username"
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

      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        PaperProps={{
          style: {
            backgroundColor: "black",
            color: "white",
            borderRadius: "8px",
            borderColor: "white", // Contours en blanc
            borderWidth: 1,
            borderStyle: "solid",
          },
        }}
      >
        <DialogTitle sx={{ color: "white", m: 0, p: 2 }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              {!registerStatus ? (
                <ReportProblemIcon sx={{ color: "red", fontSize: 40 }} />
              ) : (
                <CheckCircleOutlineIcon sx={{ color: "green", fontSize: 40 }} />
              )}
            </Grid>
            <Grid item>{"Registration Status"}</Grid>
          </Grid>
        </DialogTitle>
        <Grid container justifyContent={"center"}>
          <DialogContent dividers>
            <Grid item>
            <DialogContentText sx={{ color: "white" }}>
              {dialogMessage}
            </DialogContentText>
            </Grid>
          </DialogContent>
          <DialogActions>
          <Grid item>
            <Button
              onClick={handleClose}
              sx={{
                color: "white",
                "&:hover": { backgroundColor: "grey", color: "white" },
              }}
            >
              Close
            </Button>
            </Grid>
          </DialogActions>
        </Grid>
      </Dialog>
    </ThemeProvider>
  );
}
