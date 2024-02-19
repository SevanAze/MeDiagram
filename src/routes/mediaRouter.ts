import express from "express";
import {
    computeComments,
    deleteRating,
  getAverageRating,
  getEpisodeBySeason,
  getMediaByType,
  getRatingsBySeason,
  getSeasonsByWorkId,
  getSpecificRating,
  getTopRatedWorks,
  hasUserRated,
  modifyRating,
  submitRating,
} from "../controllers/mediaController";

const routerMedia = express.Router();

routerMedia.post("/getmediabytype", getMediaByType);
routerMedia.post("/getrating", getAverageRating);
routerMedia.post("/submitRating", submitRating);
routerMedia.get("/hasUserRated", hasUserRated);
routerMedia.get("/getSpecificRating", getSpecificRating);
routerMedia.post("/modifyRating", modifyRating);
routerMedia.post("/deleteRating", deleteRating);
routerMedia.get("/computeComments", computeComments);
routerMedia.get("/getSeasonsByWorkId", getSeasonsByWorkId);
routerMedia.get("/getRatingsBySeason", getRatingsBySeason);
routerMedia.get("/getEpisodeBySeason", getEpisodeBySeason);
routerMedia.get("/getTopRatedWorks", getTopRatedWorks);







export default routerMedia;
