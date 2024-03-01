import React, { useEffect, useState } from "react";
import axios from "axios";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  CssBaseline,
  Rating,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useAuth } from "./AuthContext";
import ResponsiveAppBar from "./components/ResponsiveAppBar";

const defaultTheme = createTheme({
  palette: {
    background: {
      default: "#000000",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        .swiper-button-next, .swiper-button-prev {
          color: white !important;
        }
      `,
    },
  },
});

function Home() {
  const { verifyToken, isAuthenticated, logout } = useAuth();
  const [topRatedWorks, setTopRatedWorks] = useState([]);
  const [initialSlide, setInitialSlide] = useState(0);

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

      const middleIndex = Math.floor(response.data.length / 2);
      setInitialSlide(middleIndex);
    } catch (error) {
      console.error("Error fetching top rated works:", error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <ResponsiveAppBar isAuthenticated={isAuthenticated} logout={logout} />
      <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ bgcolor: "black", p: 2, mb: 4 }}>
          <Typography variant="h4" color="white" textAlign="center">
            Top Rated Medias
          </Typography>
        </Box>
        <Swiper
          modules={[Navigation, Autoplay, EffectCoverflow]}
          centeredSlides={true}
          spaceBetween={50}
          initialSlide={initialSlide}
          slidesPerView={3}
          navigation
          autoplay={{
            delay: 2500,
            disableOnInteraction: true,
          }}
          effect={"coverflow"}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
        >
          {topRatedWorks.map((work) => (
            <SwiperSlide key={work?.workId}>
              <Card
                sx={{
                  bgcolor: "#313131",
                  color: "#ffffff",
                  width: 300,
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    height: 400,
                    objectFit: "cover",
                  }}
                  image={
                    work?.image_path || "https://via.placeholder.com/210x295"
                  }
                  alt={work.title}
                />
                <CardContent sx={{ textAlign: "center", paddingBottom: 6 }}>
                  <Rating
                    name="read-only"
                    value={parseFloat(work.averageRating as string) / 2}
                    precision={0.5}
                    readOnly
                    sx={{ verticalAlign: "middle" }}
                  />
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </ThemeProvider>
  );
}

export default Home;
