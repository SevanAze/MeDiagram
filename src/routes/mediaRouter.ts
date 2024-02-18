import express from "express";
import { getAverageRating, getMediaByType } from "../controllers/mediaController";

const routerMedia = express.Router();

routerMedia.post("/getmediabytype", getMediaByType);
routerMedia.post("/getrating", getAverageRating);

export default routerMedia;