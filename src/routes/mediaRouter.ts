import express from "express";
import {
  getAverageRating,
  getMediaByType,
  getSpecificRating,
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

export default routerMedia;
