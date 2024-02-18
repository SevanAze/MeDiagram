import {
  Autocomplete,
  Box,
  CardContent,
  CardMedia,
  CssBaseline,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  ThemeProvider,
  Typography
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import RatingComponent from "../components/RatingComponent";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import { Work } from "../types/Work";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        InputLabelProps: {
          style: { color: "white" },
        },
        InputProps: {
          style: { color: "white", borderColor: "white" },
        },
      },
      styleOverrides: {
        root: {
          "& label.Mui-focused": {
            color: "white",
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: "white",
          },
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
            input: {
              color: "white",
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          "&:focus": {
            backgroundColor: "#313131",
          },
          //color: "white", // Assure que le texte du select est en blanc
        },
        icon: {
          color: "white", // Assure que l'icône du select est en blanc
        },
      },
      defaultProps: {
        MenuProps: {
          style: {
            borderColor: "white",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "white", // Label color
          "&.Mui-focused": {
            color: "white", // Label color when focused
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& fieldset": {
            borderColor: "white", // Border color
          },
          "&:hover fieldset": {
            borderColor: "white", // Hover border color
          },
          "&.Mui-focused fieldset": {
            borderColor: "white", // Focused border color
          },
        },
        notchedOutline: {
          borderColor: "white", // Removes notch outline color
        },
        input: {
          color: "white", // Input text color
        },
      },
    },
  },
  palette: {
    background: {
      default: "black", // Définit le fond global en noir
    },
  },
});

const MediaRate = () => {
  const { verifyToken, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      await verifyToken();
    };

    checkAuth();
  }, [verifyToken]);

  // Simulez des données ou récupérez-les depuis une API
  const mediaTypes = [
    { label: "TV Shows", value: "serie_tv" },
    { label: "Mangas", value: "manga" },
    { label: "Book Sagas", value: "book_saga" },
    { label: "Movies", value: "movie" },
  ];

  const [selectedMediaType, setSelectedMediaType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Work[]>([]);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);

  const loadWorksByType = async (type?: string): Promise<Work[]> => {
    try {
      const response = await axios.post(
        `${process.env.BACKEND_URL}/getmediabytype`,
        { type }
      );

      if (response.status !== 200) {
        throw new Error("Network Error");
      }

      const works = await response.data;
      console.log(works);

      return works;
    } catch (error) {
      console.error("Failed to fetch works:", error);
      return [];
    }
  };

  useEffect(() => {
    loadWorksByType(selectedMediaType)
      .then(setSuggestions)
      .catch((error) => console.error(error));
  }, [selectedMediaType]);

  const handleMediaTypeChange = (event: SelectChangeEvent<string>) => {
    setSelectedMediaType(event.target.value);
  };

  const handleSearchChange = (event: any, value: any) => {
    setSearchQuery(value);
    // Implémenter la recherche ou filtrer les suggestions basées sur `value`
  };

  const handleSelect = (
    event: React.SyntheticEvent<Element, Event>,
    value: Work | null
  ) => {
    if (value) {
      // Vérifie si une valeur est sélectionnée
      setSelectedWork(value);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      {/* CssBaseline pour assurer la cohérence des styles de base */}
      <CssBaseline />
      {/* ResponsiveAppBar pour la barre de navigation */}
      <ResponsiveAppBar isAuthenticated={isAuthenticated} logout={logout} />
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Media Search
        </Typography>
        <FormControl
          variant="outlined"
          sx={{
            backgroundColor: "black",
            minWidth: 120,
            marginBottom: defaultTheme.spacing(2),
          }}
        >
          <InputLabel>Media Type</InputLabel>
          <Select
            value={selectedMediaType}
            onChange={handleMediaTypeChange}
            label="Type de Média"
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: "black", // Définit le fond du menu en noir
                  color: "white", // Assure que le texte est en blanc
                  "& .MuiMenuItem-root": {
                    // Style par défaut pour les items
                    bgcolor: "black",
                    color: "white",
                    "&:hover": {
                      // Style pour le survol
                      bgcolor: "#313131", // Change la couleur de fond lors du survol
                    },
                  },
                },
              },
            }}
          >
            {mediaTypes.map((type) => (
              <MenuItem
                key={type.value}
                value={type.value}
                sx={{ color: "white", bgcolor: "black" }}
              >
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ width: "50%" }}>
          {" "}
          <Autocomplete
            freeSolo
            disableClearable
            inputValue={searchQuery}
            onInputChange={handleSearchChange}
            options={suggestions}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.title
            }
            onChange={(event, value) => {
              // Vérifie si value est un objet, n'est pas null, et possède une propriété spécifique de Work (par exemple 'id')
              if (
                typeof value === "object" &&
                value !== null &&
                "id" in value
              ) {
                handleSelect(event, value as Work); // Cast value en Work si les conditions sont remplies
              }
            }}
            ListboxProps={{
              sx: {
                bgcolor: "black", // Définit le fond du menu en noir
                color: "white", // Assure que le texte est en blanc
                "& .MuiAutocomplete-option": {
                  borderBottom: "1px solid rgba(255, 255, 255, 0.12)", // Ajoute une bordure semi-transparente pour chaque option
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)", // Couleur de fond lors du survol
                  },
                },
                "& .MuiAutocomplete-option:last-child": {
                  borderBottom: "none", // Enlève la bordure pour le dernier élément
                },
              },
            }}
            renderOption={(props, option: Work) => (
              <Box
                component="li"
                {...props}
                sx={{ width: "auto", maxWidth: 900 }}
              >
                {" "}
                {/* Ajustez la largeur selon vos besoins */}
                <Grid container spacing={2} alignItems="center">
                  {/* Container pour l'image */}
                  <Grid item>
                    <CardMedia
                      component="img"
                      sx={{
                        width: 251,
                        height: 150,
                        aspectRatio: 3 / 2,
                        objectFit: "contain",
                      }} // Ajustez la taille de l'image selon vos besoins
                      image={option.mediaImage?.image_path}
                      alt={option.title}
                    />
                  </Grid>
                  {/* Container pour le texte (titre + description) */}
                  <Grid item xs>
                    <CardContent>
                      <Typography component="div" variant="h5">
                        {option.title}
                      </Typography>
                      <Typography variant="body2" color="white">
                        {option.description}
                      </Typography>
                    </CardContent>
                  </Grid>
                </Grid>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search"
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                  endAdornment: (
                    <React.Fragment>
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                  style: { color: "white" }, // Assure que le texte et les icônes sont en blanc
                }}
                // Appliquer les styles supplémentaires directement via sx pour cibler l'icône de suppression
                sx={{
                  "& .MuiAutocomplete-endAdornment .MuiIconButton-root": {
                    color: "white", // Change la couleur de la croix en blanc
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white", // S'assure que la bordure est également en blanc
                    },
                    "&:hover fieldset": {
                      borderColor: "white", // Couleur de la bordure au survol
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white", // Couleur de la bordure lors du focus
                    },
                  },
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "white", // Couleur de la bordure inférieure avant le focus
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "white", // Couleur de la bordure inférieure après le focus
                  },
                }}
              />
            )}
          />
        </Box>
      </Box>
      {selectedWork && (
        <RatingComponent
          work={selectedWork}
          isAuthenticated={isAuthenticated}
        />
      )}
    </ThemeProvider>
  );
};

export default MediaRate;
