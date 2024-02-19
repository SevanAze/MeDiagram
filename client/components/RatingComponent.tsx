import AddBoxIcon from "@mui/icons-material/AddBox";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Work } from "../types/Work";
import RatingWorkModal from "./modals/RatingWorkModal";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import RatingComments from "./RatingComment";
import RateGraphTvShow from "./RateGraphTvShow";

interface RatingComponentProps {
  work: Work;
  isAuthenticated: boolean;
  userId?: number;
}

const RatingComponent: React.FC<RatingComponentProps> = ({
  work,
  isAuthenticated,
  userId,
}) => {
  const [averageWorkRating, setAverageWorkRating] = useState<string | number>(
    "Loading..."
  );
  const [ratesCount, setRatesCount] = useState<number>();
  const [ratingModalOpen, setRatingModalOpen] = useState<boolean>(false);
  const [userHasRated, setUserHasRated] = useState(false);
  const [error, setError] = useState("");

  const [userRating, setUserRating] = useState<string>("");
  const [comment, setComment] = useState<string>("");

  const handleOpenModal = () => {
    if (isAuthenticated) setRatingModalOpen(true);
  };
  const handleCloseModal = () => {
    setRatingModalOpen(false);
  };

  useEffect(() => {
    const fetchAverageWorkRating = async () => {
      try {
        const response = await axios.post(`/getrating`, {
          targetId: work.id,
          targetType: "work",
        });

        setAverageWorkRating(response.data.averageRating);
        setRatesCount(response.data.ratingsCount);
      } catch (error) {
        console.error("Error fetching average rating:", error);
        setAverageWorkRating("Not rated yet");
      }
    };

    fetchAverageWorkRating();
  }, [work, ratingModalOpen]);

  useEffect(() => {
    if (isAuthenticated && userId) {
      axios
        .get(`/hasUserRated?userId=${userId}&workId=${work.id}`)
        .then((response) => {
          setUserHasRated(response.data.hasRated);
        })
        .catch((error) => {
          console.error("Error checking user rating:", error);
        });
    }
  }, [work, userId, isAuthenticated, ratingModalOpen]);

  useEffect(() => {
    if (userHasRated) {
      const fetchUserRating = async () => {
        if (!userId || !work.id || !open) return;

        try {
          const response = await axios.get(
            `/getSpecificRating?userId=${userId}&workId=${work.id}`
          );
          if (response.data) {
            setUserRating(response.data.rating.toString());
            setComment(response.data.comment || "");
          }
        } catch (error) {
          console.error("Error fetching user rating:", error);
          setError("Failed to fetch rating");
        }
      };
      fetchUserRating();
    }
  }, [userId, work.id, ratingModalOpen, userHasRated]);

  return (
    <Grid
      container
      direction="column"
      spacing={4}
      sx={{ width: "100%", mt: 4 }}
    >
      <Grid item>
        <Card
          sx={{
            display: "flex",
            flexDirection: "row",
            bgcolor: "black",
            color: "white",
            maxWidth: 1200,
            mx: "auto",
          }}
        >
          <CardMedia
            component="img"
            sx={{ width: 251, height: 251, objectFit: "contain" }}
            image={
              work.mediaImage?.image_path ||
              "https://via.placeholder.com/250x150"
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
                  {averageWorkRating + " / 10"}{" "}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" sx={{ color: "white" }}>
                  <span style={{ fontWeight: "bold", fontSize: 15 }}>
                    Rates :
                  </span>{" "}
                  {ratesCount}
                </Typography>
              </Grid>
            </Grid>
            <Grid container alignItems="center" spacing={1}>
              {isAuthenticated && (
                <>
                  {!userHasRated ? (
                    // Lorsque l'utilisateur n'a pas encore noté
                    <>
                      <Grid item>
                        <Typography
                          onClick={handleOpenModal}
                          variant="body2"
                          sx={{ color: "white" }}
                        >
                          {"Add your rating "}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <AddBoxIcon
                          sx={{ color: "white", verticalAlign: "middle" }}
                          onClick={handleOpenModal}
                        />
                      </Grid>
                    </>
                  ) : (
                    // Lorsque l'utilisateur a déjà noté
                    <>
                      <Grid item>
                        <Typography
                          onClick={handleOpenModal}
                          variant="body2"
                          sx={{ color: "white" }}
                        >
                          {"Your rating : "}
                          {userRating + " / 10"}{" "}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <BorderColorIcon
                          sx={{ color: "white", verticalAlign: "middle" }}
                          onClick={handleOpenModal}
                        />
                      </Grid>
                    </>
                  )}
                </>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        {work.type !== "movie" && (
          <Box
            sx={{
              mt: 4,
              bgcolor: "#313131",
              p: 3,
              borderRadius: 2,
              boxShadow: 3,
              maxWidth: 1200,
              mx: "auto",
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
              Season Ratings
            </Typography>
            <Divider sx={{ my: 1, bgcolor: "grey.700" }} />
              <Grid item>
                <RateGraphTvShow workId={work.id} userId={userId} isAuthenticated={isAuthenticated} />
              </Grid>
          </Box>
        )}
      </Grid>
      <Grid item>
        {work.id && (
          <RatingComments workId={work.id} ratingModalOpen={ratingModalOpen} />
        )}
      </Grid>
      <RatingWorkModal
        open={ratingModalOpen}
        onClose={handleCloseModal}
        workId={parseInt(work.id)}
        userId={userId}
        userHasRated={userHasRated}
        setComment={setComment}
        setUserRating={setUserRating}
        comment={comment}
        userRating={userRating}
        //fetchAverageWorkRating={fetchAverageWorkRating}
      />
    </Grid>
  );
};

export default RatingComponent;
