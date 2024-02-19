import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart } from "@mui/x-charts";
import {
  Select,
  MenuItem,
  Box,
  Typography,
  FormControl,
  Grid
} from "@mui/material";

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
}

const RateGraphTvShow: React.FC<RateGraphProps> = ({ workId }) => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | "">("");
  const [episodeRatings, setEpisodeRatings] = useState<EpisodeRating[]>([]);

  // Fetch seasons for the work
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

  // Fetch episode ratings for the selected season
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

  return (
    <Grid container direction="column" alignItems="center" justifyContent="center">
      <Grid item xs={12}>
        {seasons.length > 0 && (
          <Box sx={{ my: 2 }}>
            <Typography variant="h6" color={"white"}>
              Select Season:
            </Typography>
            <FormControl fullWidth sx={{ m: 1, minWidth: 120, maxWidth: 300 }}>
              <Select
                value={selectedSeasonId}
                onChange={handleSeasonChange}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem value=""><em>Select a season</em></MenuItem>
                {seasons.map((season) => (
                  <MenuItem key={season.id} value={season.id.toString()}>
                    {season.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
      </Grid>
      <Grid item xs={12}>
        {selectedSeasonId && (
          <LineChart
          sx={{
            borderRadius: "12px",
            bgcolor: '#2B2B2B',
            // Changer les styles des étiquettes de l'axe du bas
            "& .MuiChartsAxis-bottom .MuiChartsAxis-tick": {
              stroke: "#FFFFFF", // Mettre les étiquettes en blanc
            },
            "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
              fill: "#FFFFFF", // Mettre les étiquettes en blanc
            },
            // Styles de ligne de l'axe du bas
            "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
              stroke: "#FFFFFF", // Ligne de l'axe en blanc
            },
            // Changer les styles des étiquettes de l'axe du bas
            "& .MuiChartsAxis-directionY .MuiChartsAxis-tick": {
              stroke: "#FFFFFF", // Mettre les étiquettes en blanc
            },
            "& .MuiChartsAxis-directionY .MuiChartsAxis-tickLabel": {
              fill: "#FFFFFF", // Mettre les étiquettes en blanc
            },
            // Styles de ligne de l'axe du bas
            "& .MuiChartsAxis-directionY .MuiChartsAxis-line": {
              stroke: "#FFFFFF", // Ligne de l'axe en blanc
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
                tickLabelStyle: { fill: "#FFFFFF" }, // Appliquer la couleur blanche aux étiquettes de l'axe Y
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
                tickLabelStyle: { fill: "#FFFFFF" }, // Appliquer la couleur blanche aux étiquettes de l'axe Y
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
    </Grid>
  );
};

export default RateGraphTvShow;
