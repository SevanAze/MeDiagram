import React, { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import axios from "axios";

interface Episode {
  id: number;
  title: string;
  userHasRated: boolean;
}

interface RatingEpisodeModalProps {
  open: boolean;
  onClose: () => void;
  seasonId: number;
  userId?: number;
}

const RatingEpisodeModal: React.FC<RatingEpisodeModalProps> = ({
  open,
  onClose,
  seasonId,
  userId,
}) => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<number | "">("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await axios.get(
          `/getEpisodeBySeason?seasonId=${seasonId}&userId=${userId}`
        );
        setEpisodes(response.data);
      } catch (error) {
        console.error("Error fetching episodes:", error);
      }
    };

    if (seasonId) fetchEpisodes();
  }, [seasonId, open]);

  const handleSubmit = async () => {
    if (!selectedEpisodeId || !rating) {
      setError("Please select an episode and provide a rating.");
      return;
    }

    try {
      await axios.post(`/submitRating`, {
        userId: userId,
        targetId: selectedEpisodeId,
        targetType: "component",
        rating: Number(rating),
        comment: comment,
      });
      onClose();
    } catch (error) {
      console.error("Error submitting rating:", error);
      setError("Failed to submit rating.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...style, width: 400, bgcolor: "black", color: "white" }}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Rate an Episode
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <FormControl
          fullWidth
          sx={{
            mt: 2,
            ".MuiInputBase-root": { color: "white" },
            ".MuiOutlinedInput-notchedOutline": { borderColor: "white" },
          }}
        >
          <InputLabel id="episode-select-label" sx={{ color: "white" }}>
            Episode
          </InputLabel>
          <Select
            labelId="episode-select-label"
            id="episode-select"
            value={selectedEpisodeId}
            label="Episode"
            onChange={(e) => setSelectedEpisodeId(Number(e.target.value))}
          >
            {episodes.map((episode) => (
              <MenuItem key={episode.id} value={episode.id}>
                {episode.title} {episode.userHasRated ? "(Already rated)" : ""}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          margin="normal"
          id="rating"
          label="Rating (0-10)"
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          InputProps={{
            inputProps: { min: 0, max: 10 },
            style: { color: "white" },
          }}
          InputLabelProps={{
            style: { color: "white" },
          }}
          sx={{
            ".MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" },
            },
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
          InputProps={{
            style: { color: "white" },
          }}
          InputLabelProps={{
            style: { color: "white" },
          }}
          sx={{
            ".MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" },
            },
          }}
        />
        <Button
          onClick={handleSubmit}
          sx={{
            mt: 2,
            bgcolor: "grey",
            color: "white",
            "&:hover": { bgcolor: "grey.700" },
          }}
        >
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
  p: 4,
};

export default RatingEpisodeModal;
