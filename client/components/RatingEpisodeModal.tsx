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
  rating?: number;
  comment?: string;
}

interface RatingEpisodeModalProps {
  open: boolean;
  onClose: () => void;
  seasonId: number;
  userId?: number;
  workId: string;
}

const RatingEpisodeModal: React.FC<RatingEpisodeModalProps> = ({
  open,
  onClose,
  seasonId,
  userId,
  workId,
}) => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<number | "">("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [hasUserRated, setHasUserRated] = useState(false);

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

  useEffect(() => {
    const selectedEpisode = episodes.find(episode => episode.id === Number(selectedEpisodeId));
    if (selectedEpisode) {
      if (selectedEpisode.userHasRated) {
        setRating(selectedEpisode.rating?.toString() || "");
        setComment(selectedEpisode.comment || "");
        setHasUserRated(true);
      } else {
        setRating("");
        setComment("");
        setHasUserRated(false);
      }
    }
  }, [selectedEpisodeId, episodes]);

  const handleSubmit = async () => {
    if (!selectedEpisodeId || !rating) {
      setError("Please select an episode and provide a rating.");
      return;
    }

    const url = hasUserRated ? `/modifyRating` : `/submitRating`;
    const data = {
      userId: userId,
      targetId: selectedEpisodeId,
      targetType: "component",
      rating: Number(rating),
      comment: comment,
      workId: workId,
    };

    try {
      await axios.post(url, data);
      onClose();
    } catch (error) {
      console.error(`Error ${hasUserRated ? "modifying" : "submitting"} rating:`, error);
      setError(`Failed to ${hasUserRated ? "modify" : "submit"} rating.`);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...style, width: 400, bgcolor: "#313131" }}>
        <Typography id="modal-modal-title" variant="h6" component="h2" color="white">
          Rate an Episode
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel id="episode-select-label" sx={{ color: "white" }}>Episode</InputLabel>
          <Select
            labelId="episode-select-label"
            id="episode-select"
            value={selectedEpisodeId}
            label="Episode"
            onChange={(e) => setSelectedEpisodeId(Number(e.target.value))}
            sx={{ color: "white", ".MuiOutlinedInput-notchedOutline": { borderColor: "white" } }}
          >
            {episodes.map((episode) => (
              <MenuItem key={episode.id} value={episode.id} sx={{ color: "#313131", backgroundColor: "white" }}>
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
        />
        <Button
          onClick={handleSubmit}
          sx={{
            mt: 2,
            bgcolor: "grey",
            color: "white",
            '&:hover': { bgcolor: "grey.700" },
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
  bgcolor: "#313131",
  boxShadow: 24,
  p: 4,
  color: "white",
};

export default RatingEpisodeModal;
