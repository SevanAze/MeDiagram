import {
  Alert,
  Box,
  Button,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface RatingModalProps {
  open: boolean;
  onClose: () => void;
  workId: number;
  userId?: number;
  userHasRated: boolean;
  setComment: React.Dispatch<React.SetStateAction<string>>;
  setUserRating: React.Dispatch<React.SetStateAction<string>>;
  comment: string,
  userRating: string,
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "black",
  color: "white",
  border: "2px solid #fff",
  boxShadow: 24,
  borderRadius: "12px",
  p: 4,
};

const RatingWorkModal: React.FC<RatingModalProps> = ({
  open,
  onClose,
  workId,
  userId,
  userHasRated,
  setComment,
  setUserRating,
  comment,
  userRating,
}) => {
  const [error, setError] = useState<string>("");

  const validateRating = (rating: string): boolean => {
    const numRating = parseInt(rating, 10);
    if (rating === "") {
      setError(""); // Clear error for empty string (user clearing the input)
      return true; // Allow empty value for user to clear or edit
    } else if (numRating >= 0 && numRating <= 10) {
      setError(""); // Clear error if within range
      return true;
    } else {
      setError("Your rating must be between 0 and 10");
      return false;
    }
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rating = e.target.value;
    if (validateRating(rating)) {
      setUserRating(rating);
    }
  };

  const handleSubmitRating = async () => {
    if (!validateRating(userRating)) return; // Empêche la soumission si non valide

    const endpoint = userHasRated ? "/modifyRating" : "/submitRating";

    try {
      const response = await axios.post(endpoint, {
        userId: userId,
        targetId: workId,
        targetType: "work", // Ou "component", selon le contexte
        rating: Number(userRating),
        comment,
      });

      if (response.status === 200) {
        onClose(); // Fermer la modal après la soumission réussie
        // Optionnellement, rafraîchir les données affichées, comme la moyenne des ratings
      } else {
        throw new Error("Failed to submit rating");
      }
    } catch (error) {
      console.error("Error submitting or updating rating:", error);
      setError("Failed to submit or update rating");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Submit Your Rating
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          fullWidth
          margin="normal"
          id="userRating"
          label="Rating (0-10)"
          type="number"
          value={userRating}
          onChange={handleRatingChange}
          InputLabelProps={{ style: { color: "white" } }}
          InputProps={{
            style: { color: "white" },
            inputProps: { min: 0, max: 10 },
          }}
        />
        <TextField
          fullWidth
          margin="normal"
          id="comment"
          label="Comment"
          type="text"
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          InputLabelProps={{ style: { color: "white" } }}
          InputProps={{
            style: { color: "white" },
          }}
          sx={{
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
          }}
        />

        <Button
          onClick={handleSubmitRating}
          disabled={userRating === "" || error !== ""}
          sx={{
            mt: 2,
            bgcolor: "white",
            color: "black",
            "&:hover": { bgcolor: "grey.300" },
          }}
        >
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default RatingWorkModal;
