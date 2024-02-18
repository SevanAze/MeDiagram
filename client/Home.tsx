import React, { useEffect, useMemo, useState } from "react";
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
  const { verifyToken, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      await verifyToken();
    };
  
    checkAuth();
  }, [verifyToken]);


  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <ResponsiveAppBar isAuthenticated={isAuthenticated} logout={logout} />
      <Container component="main" maxWidth="xs"></Container>
    </ThemeProvider>
  );
}

export default Home;
