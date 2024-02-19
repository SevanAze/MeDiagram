import { Card, CardContent, CardMedia, Container, CssBaseline, Grid, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";
import { default as React, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import ResponsiveAppBar from "./components/ResponsiveAppBar";

const defaultTheme = createTheme({
  palette: {
    background: {
      default: "#121212",
    },
  },
});

function Home() {
  const { verifyToken, isAuthenticated, logout } = useAuth();
  const [topRatedWorks, setTopRatedWorks] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      await verifyToken();
    };
    checkAuth();
    fetchTopRatedWorks();
  }, [verifyToken]);

  const fetchTopRatedWorks = async () => {
    try {
      const response = await axios.get("/getTopRatedWorks");
      setTopRatedWorks(response.data);
    } catch (error) {
      console.error("Error fetching top rated works:", error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <ResponsiveAppBar isAuthenticated={isAuthenticated} logout={logout} />
      <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
        {/* Ajoutez un espace au-dessus du Container */}
        <Grid container spacing={4} justifyContent={'center'}>
          {topRatedWorks.map((work) => (
            <Grid item xs={12} sm={6} md={4} key={work?.workId}>
              <Card sx={{ bgcolor: '#2b2b2b', color: '#ffffff' }}>
                <CardMedia
                  sx={{ width: 251, height: 251, objectFit: "contain", bgcolor: '#2B2B2B', mt: 1 }}
                  component="img"
                  image={work?.image_path || "https://via.placeholder.com/210x295"}
                  alt={work.title}
                />
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {work.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    Rating: {parseFloat(work.averageRating).toFixed(1)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default Home;
