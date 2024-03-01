import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart } from "@mui/x-charts";
import {
  Select,
  MenuItem,
  Box,
  Typography,
  FormControl,
  Grid,
  Button,
  InputBase,
  styled,
} from "@mui/material";
import RatingEpisodeModal from "./RatingEpisodeModal";

interface Season {
  id: number;
  title: string;
}

interface EpisodeRating {
  episodeNumber: number;
  averageRating: number;
}

interface RateGraphProps {
  workId: string;
  userId?: number;
  isAuthenticated: boolean;
}

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: '#2B2B2B',
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}));

const RateGraphTvShow: React.FC<RateGraphProps> = ({
  workId,
  userId,
  isAuthenticated,
}) => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | "">("");
  const [episodeRatings, setEpisodeRatings] = useState<EpisodeRating[]>([]);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const response = await axios.get(`/getSeasonsByWorkId?workId=${workId}`);
        setSeasons(response.data);
      } catch (error) {
        console.error("Error fetching seasons:", error);
      }
    };
    fetchSeasons();
  }, [workId]);

  useEffect(() => {
    const fetchEpisodeRatings = async () => {
      if (selectedSeasonId === "") return;
      try {
        const response = await axios.get(`/getRatingsBySeason?seasonId=${selectedSeasonId}`);
        setEpisodeRatings(response.data);
      } catch (error) {
        console.error("Error fetching episode ratings:", error);
      }
    };
    fetchEpisodeRatings();
  }, [selectedSeasonId]);

  const handleSeasonChange = (event: any) => {
    setSelectedSeasonId(event.target.value as number);
  };

  const handleOpenModal = () => {
    setRatingModalOpen(true);
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Grid item xs={12}>
        <Box sx={{ my: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h6" color={"white"} sx={{ marginRight: 2 }}>
            Select Season:
          </Typography>
          <FormControl variant="outlined" sx={{ m: 1, minWidth: 120, maxWidth: 300, color: 'white' }}>
            <Select
              value={selectedSeasonId}
              onChange={handleSeasonChange}
              input={<BootstrapInput />}
              sx={{color: 'white'}}
            >
              <MenuItem value="">
                <em>Select a season</em>
              </MenuItem>
              {seasons.map((season) => (
                <MenuItem key={season.id} value={season.id.toString()}>
                  {season.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {isAuthenticated && <Button
            variant="contained"
            sx={{
              bgcolor: "#2B2B2B",
              color: "white",
              "&:hover": {
                bgcolor: "#3C3C3C",
              },
              ml: 2, // Adjusted for spacing
            }}
            onClick={handleOpenModal}
          >
            Add your rating to an episode
          </Button>}
        </Box>
      </Grid>
      <Grid item xs={12}>
        {selectedSeasonId && (
          <LineChart
          sx={{
            borderRadius: "12px",
            bgcolor: "#2B2B2B",
            "& .MuiChartsAxis-bottom .MuiChartsAxis-tick": {
              stroke: "#FFFFFF",
            },
            "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
              fill: "#FFFFFF",
            },
            "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
              stroke: "#FFFFFF",
            },
            "& .MuiChartsAxis-directionY .MuiChartsAxis-tick": {
              stroke: "#FFFFFF",
            },
            "& .MuiChartsAxis-directionY .MuiChartsAxis-tickLabel": {
              fill: "#FFFFFF",
            },
            "& .MuiChartsAxis-directionY .MuiChartsAxis-line": {
              stroke: "#FFFFFF",
            },
          }}
          xAxis={[
            {
              data: episodeRatings.map((rating) => rating.episodeNumber),
              min: 1,
              max: episodeRatings.length,
              tickMaxStep: 1,
              tickMinStep: 1,
              label: "Episode Numbers",
              labelStyle: { fill: "#FFFFFF" },
              tickLabelStyle: { fill: "#FFFFFF" },
              stroke: "#FFFFFF",
            },
          ]}
          yAxis={[
            {
              min: 0,
              max: 10,
              tickMaxStep: 1,
              tickMinStep: 1,
              label: "Episode Rating",
              labelStyle: { fill: "#FFFFFF" },
              tickLabelStyle: { fill: "#FFFFFF" },
              stroke: "#FFFFFF",
            },
          ]}
          series={[
            {
              data: episodeRatings.map((rating) => rating.averageRating),
            },
          ]}
          width={800}
          height={500}
        />
        )}
      </Grid>
      <RatingEpisodeModal
        open={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        seasonId={Number(selectedSeasonId)}
        userId={userId}
        workId={workId}
      />
    </Grid>
  );
};

export default RateGraphTvShow;
