import AddBoxIcon from "@mui/icons-material/AddBox";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Grid,
  Rating,
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
  selectedMediaType: string;
}

interface CustomBoxProps {
  contentComponent: React.ReactNode;
}

const CustomBox: React.FC<CustomBoxProps> = ({ contentComponent }) => {
  return (
    <Box
      component="a"
      href="#basic-chip"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "10px",
        gap: "10px",
        backgroundColor: "#313131",
        color: "white",
        border: "1px solid white",
        borderRadius: "16px",
        textDecoration: "none",
        maxWidth: "fit-content",
        overflow: "hidden",
        whiteSpace: "normal",
      }}
    >
      {contentComponent}
    </Box>
  );
};

const RatingComponent: React.FC<RatingComponentProps> = ({
  work,
  isAuthenticated,
  userId,
  selectedMediaType,
}) => {
  const [averageWorkRating, setAverageWorkRating] = useState<string | number>("Loading...");
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
            sx={{ width: 251, height: 300, objectFit: "contain" }}
            image={
              work.mediaImage?.image_path ||
              "https://via.placeholder.com/250x150"
            }
            alt={work.title}
          />
          <CardContent sx={{ mx: 2, bgcolor: "#313131", flexGrow: 1 }}>
            <Typography variant="h5" component="div">
              {work.title}
            </Typography>
            <Divider sx={{ my: 1, bgcolor: "grey.700" }} />
            <CustomBox
              contentComponent={
                <Typography variant="body2" sx={{ color: "white" }}>
                  <span style={{ fontWeight: "bold", fontSize: 15 }}>
                    Description :
                  </span>{" "}
                  {work.description}
                </Typography>
              }
            />
            <Divider sx={{ my: 1, bgcolor: "grey.700" }} />
            <CustomBox
              contentComponent={
                <Typography variant="body2" sx={{ color: "white" }}>
                  <span style={{ fontWeight: "bold", fontSize: 15 }}>
                    Release Year :
                  </span>{" "}
                  {work.releaseYear}
                </Typography>
              }
            />
            <Divider sx={{ my: 1, bgcolor: "grey.700" }} />
            <CustomBox
              contentComponent={
                <Typography variant="body2" sx={{ color: "white" }}>
                  <span style={{ fontWeight: "bold", fontSize: 15 }}>
                    Genre :
                  </span>{" "}
                  {work.genre}
                </Typography>
              }
            />
            <Divider sx={{ my: 1, bgcolor: "grey.700" }} />
            <Grid container alignItems="center" spacing={1}>
              <Grid item xs={12}>
                <CustomBox
                  contentComponent={
                    <Grid container direction="row" alignItems="center" spacing={1}>
                      <Grid item>
                        <Typography variant="body2" sx={{ color: "white" }}>
                          <span style={{ fontWeight: "bold", fontSize: 15 }}>
                            Rating:
                          </span>
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Rating
                          name="read-only"
                          value={parseInt(averageWorkRating as string) / 2}
                          precision={0.5}
                          readOnly
                          sx={{ verticalAlign: "middle" }}
                        />
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" sx={{ color: "white" }}>
                          <span style={{ fontWeight: "bold", fontSize: 15 }}>
                            Rates:
                          </span>{" "}
                          {ratesCount}
                        </Typography>
                      </Grid>
                    </Grid>
                  }
                />
              </Grid>
              {isAuthenticated && (
                <Grid item xs={12}>
                  {!userHasRated ? (
                    <Typography
                      onClick={handleOpenModal}
                      variant="body2"
                      sx={{ color: "white" }}
                    >
                      <Chip
                        icon={<AddBoxIcon sx={{ color: "white" }} />}
                        label="Add your rating"
                        clickable
                        variant="outlined"
                        sx={{
                          color: "white",
                          borderColor: "white",
                          "& .MuiSvgIcon-root": { color: "white" },
                        }}
                      />
                    </Typography>
                  ) : (
                    <Grid container direction="row" alignItems="center" spacing={1}>
                      <Grid item>
                        <Typography
                          onClick={handleOpenModal}
                          variant="body2"
                          sx={{ color: "white", cursor: "pointer" }}
                        >
                          <span style={{ fontWeight: "bold", fontSize: 15 }}>
                            Your rating :
                          </span>
                          {" " + userRating + " / 10"}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Chip
                          onClick={handleOpenModal}
                          icon={<BorderColorIcon sx={{ color: "white" }} />}
                          label="Edit your rating"
                          sx={{
                            color: "white",
                            borderColor: "white",
                            "& .MuiSvgIcon-root": { color: "white" },
                            cursor: "pointer",
                          }}
                          clickable
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  )}
                </Grid>
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
              <RateGraphTvShow
                workId={work.id}
                userId={userId}
                isAuthenticated={isAuthenticated}
              />
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
      />
    </Grid>
  );
};

export default RatingComponent;
