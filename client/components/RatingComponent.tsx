import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { Work } from "../types/Work";
import axios from "axios";
import AddBoxIcon from "@mui/icons-material/AddBox";
import RatingWorkModal from "./modals/RatingWorkModal";

interface RatingComponentProps {
  work: Work;
  isAuthenticated: boolean;
}

const RatingComponent: React.FC<RatingComponentProps> = ({ work, isAuthenticated }) => {
  const [averageWorkRating, setAverageWorkRating] = useState<string | number>(
    "Loading..."
  );
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState('');

  const handleOpenModal = () => {
    if(isAuthenticated) setModalOpen(true);
  };
  const handleCloseModal = () => setModalOpen(false);

  useEffect(() => {
    const fetchAverageWorkRating = async () => {
      try {
        const response = await axios.post(
          `${process.env.BACKEND_URL}/getrating`,
          { targetId: work.id, targetType: "work" }
        );

        setAverageWorkRating(
          response.data.averageRating.toFixed(1) || "Not rated yet"
        );
      } catch (error) {
        console.error("Error fetching average rating:", error);
        setAverageWorkRating("Error loading rating");
      }
    };

    fetchAverageWorkRating();
  }, [work]);

  return (
    <Box
      sx={{ mt: 4, display: "flex", justifyContent: "center", width: "100%" }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "row",
          maxWidth: 1200,
          width: "100%",
          bgcolor: "black",
          color: "white",
        }}
      >
        <CardMedia
          component="img"
          sx={{ width: 251, height: 251, objectFit: "contain" }}
          image={
            work.mediaImage?.image_path || "https://via.placeholder.com/250x150"
          }
          alt={work.title}
        />
        <CardContent sx={{ mx: 2, bgcolor: "#313131" }}>
          <Typography variant="h5" component="div">
            {work.title}
          </Typography>
          <Divider sx={{ my: 1, bgcolor: "grey.700" }} />
          <Typography variant="body2" sx={{ color: "white" }}>
            <span style={{ fontWeight: "bold", fontSize: 15 }}>
              Description :
            </span>{" "}
            {work.description}
          </Typography>
          <Divider sx={{ my: 1, bgcolor: "grey.700" }} />
          <Typography variant="body2" sx={{ color: "white" }}>
            <span style={{ fontWeight: "bold", fontSize: 15 }}>
              Release Year :
            </span>{" "}
            {work.releaseYear}
          </Typography>
          <Divider sx={{ my: 1, bgcolor: "grey.700" }} />
          <Typography variant="body2" sx={{ color: "white" }}>
            <span style={{ fontWeight: "bold", fontSize: 15 }}>Genre :</span>{" "}
            {work.genre}
          </Typography>
          <Divider sx={{ my: 1, bgcolor: "grey.700" }} />
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <Typography variant="body2" sx={{ color: "white" }}>
                <span style={{ fontWeight: "bold", fontSize: 15 }}>
                  Rating :
                </span>{" "}
                {averageWorkRating + " / 10"}
              </Typography>
            </Grid>
            <Grid item>
            {isAuthenticated && <AddBoxIcon sx={{ color: "white", verticalAlign: "middle" }} onClick={handleOpenModal} />}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {work.type !== "movie" && (
        <Box
          sx={{
            mt: 2,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              maxWidth: 600,
              width: "100%",
              bgcolor: "black",
              color: "white",
              p: 2,
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Notes par saison
            </Typography>
            <Divider sx={{ my: 1, bgcolor: "grey.700" }} />
            {/* Insérez votre composant de graphique ici */}
            <Typography variant="body2">
              Graphique des notes par saison ici
            </Typography>
          </Box>
        </Box>
      )}
      {<RatingWorkModal
        open={modalOpen}
        onClose={handleCloseModal}
        workId={parseInt(work.id)}
        //fetchAverageWorkRating={fetchAverageWorkRating}
      />}
    </Box>
    
  );
};

export default RatingComponent;
