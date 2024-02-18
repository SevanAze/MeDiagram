import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Divider,
  Grid,
  Typography,
  Pagination,
} from "@mui/material";
import axios from "axios";

interface RatingComment {
  id: number;
  comment: string;
  rating: number;
  date: string;
  userName: string;
}

interface RatingCommentsProps {
  workId: string;
  ratingModalOpen: boolean;
}

const RatingComments: React.FC<RatingCommentsProps> = ({ workId, ratingModalOpen }) => {
  const [comments, setComments] = useState<RatingComment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchComments = async (page: number) => {
    try {
      const response = await axios.get(
        `/computeComments?workId=${workId}&page=${page}`
      );
      setComments(response.data.comments);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching rating comments:", error);
    }
  };

  useEffect(() => {
    fetchComments(currentPage);
  }, [workId, currentPage, ratingModalOpen]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
        mt: 4,
        mb: 4,
        bgcolor: "#313131",
        color: "white",
        p: 2,
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Users ratings
      </Typography>
      {comments.map((comment, index) => (
        <Box
          key={comment.id}
          sx={{
            mb: 2,
            bgcolor: "rgba(255, 255, 255, 0.1)",
            p: 1,
            borderRadius: "8px",
          }}
        >
          <Grid container spacing={1} alignItems="center">
          <Grid item>
              <Card
                variant="outlined"
                sx={{
                  bgcolor: "#424242",
                  width: "fit-content",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" sx={{ m: 1, color: "white" }}>
                  User: {comment.userName}
                </Typography>
              </Card>
            </Grid>
            <Grid item>
              <Card
                variant="outlined"
                sx={{
                  bgcolor: "#424242",
                  width: "fit-content",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" sx={{ m: 1, color: "white" }}>
                  Rating: {comment.rating} / 10
                </Typography>
              </Card>
            </Grid>
            <Grid item>
              <Card
                variant="outlined"
                sx={{
                  bgcolor: "#424242",
                  width: "fit-content",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" sx={{ m: 1, color: "white" }}>
                  Date: {comment.date}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ bgcolor: "#424242" }}>
                <Typography variant="body1" sx={{ m: 1, color: "white" }}>
                  Comment: {comment.comment}
                </Typography>
              </Card>
            </Grid>
          </Grid>
          {index < comments.length - 1 && (
            <Divider sx={{ my: 2, bgcolor: "grey.700" }} />
          )}
        </Box>
      ))}
      {totalPages > 1 && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, page) => setCurrentPage(page)}
            sx={{ ".MuiPaginationItem-root": { color: "white" } }}
          />
        </Box>
      )}
    </Box>
  );
};

export default RatingComments;
