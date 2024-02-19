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
  Grid
} from "@mui/material";
import axios from "axios";

interface Episode {
  id: number;
  title: string;
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
      // Remplacer `/api/episodes` par votre véritable endpoint d'API pour récupérer les épisodes d'une saison
      try {
        const response = await axios.get(`/api/seasons/${seasonId}/episodes`);
        setEpisodes(response.data);
      } catch (error) {
        console.error("Error fetching episodes:", error);
      }
    };

    if (seasonId) fetchEpisodes();
  }, [seasonId]);

  const handleSubmit = async () => {
    // Valider la note et le commentaire avant de soumettre
    if (!selectedEpisodeId) {
      setError("Please select an episode.");
      return;
    }
    if (!rating) {
      setError("Please provide a rating.");
      return;
    }

    // Remplacer `/submitRating` par votre véritable endpoint d'API pour soumettre la note
    try {
      await axios.post(`/submitRating`, {
        userId,
        targetId: selectedEpisodeId,
        targetType: "episode", // Assurez-vous que votre backend traite ce targetType
        rating: Number(rating),
        comment,
      });
      onClose(); // Fermer la modal après soumission réussie
    } catch (error) {
      console.error("Error submitting rating:", error);
      setError("Failed to submit rating.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...style, width: 400, p: 4 }}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Rate an Episode
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="episode-select-label">Episode</InputLabel>
          <Select
            labelId="episode-select-label"
            id="episode-select"
            value={selectedEpisodeId}
            label="Episode"
            onChange={(e) => setSelectedEpisodeId(Number(e.target.value))}
          >
            {episodes.map((episode) => (
              <MenuItem key={episode.id} value={episode.id}>
                {episode.title}
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
        />
        <Button
          onClick={handleSubmit}
          sx={{ mt: 2, bgcolor: "primary.main", color: "white" }}
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
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default RatingEpisodeModal;
