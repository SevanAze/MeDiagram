import React, { useState } from 'react';
import { Box, Typography, Modal, Button, TextField } from '@mui/material';
import axios from 'axios';

interface RatingModalProps {
  open: boolean;
  onClose: () => void;
  workId: number;
  //fetchAverageWorkRating: () => void; // Fonction pour rafraîchir la note moyenne après soumission
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const RatingModal: React.FC<RatingModalProps> = ({ open, onClose, workId }) => {
  const [userRating, setUserRating] = useState<string>('');

  const handleSubmitRating = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/submitRating`, {
        targetId: workId,
        targetType: 'work',
        rating: Number(userRating),
      });
      //fetchAverageWorkRating(); // Rafraîchir la note moyenne
      onClose(); // Fermer la modal après la soumission
    } catch (error) {
      console.error("Error submitting rating:", error);
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
        <TextField
          fullWidth
          margin="normal"
          id="userRating"
          label="Rating (0-10)"
          type="number"
          value={userRating}
          onChange={(e) => setUserRating(e.target.value)}
        />
        <Button onClick={handleSubmitRating} sx={{ mt: 2 }}>
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default RatingModal;
