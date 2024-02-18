import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart } from "@mui/x-charts";
import { Select, MenuItem, Box, Typography, FormControl } from "@mui/material";

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
        const response = await axios.get(
          `/getSeasonsByWorkId?workId=${workId}`
        );
        console.log("response.data", response.data);
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
        const response = await axios.get(
          `/getRatingsBySeason?seasonId=${selectedSeasonId}`
        );
        console.log(response.data);
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
    <Box>
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
              sx={{ textAlign: "center" }}
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
        </Box>
      )}

      {selectedSeasonId && (
        <LineChart
          xAxis={[
            {
              data: episodeRatings.map((rating) => rating.episodeNumber),
              min: 1,
              max: episodeRatings.length,
              tickMaxStep: 1,
              tickMinStep: 1,
            },
          ]}
          yAxis={[
            {
              min: 0,
              max: 10,
              tickMaxStep: 1,
              tickMinStep: 1,
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
    </Box>
  );
};

export default RateGraphTvShow;
