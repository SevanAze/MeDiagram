import React from "react";
import { useAuth } from "./AuthContext";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Container, CssBaseline } from "@mui/material";
// Importez d'autres composants de page ici

const defaultTheme = createTheme({
  palette: {
    background: {
      default: "black", // Définit le fond global en noir
    },
  },
});

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <ResponsiveAppBar isAuthenticated={isAuthenticated} />
      <Container component="main" maxWidth="xs"></Container>
    </ThemeProvider>
  );
}

export default Home;
