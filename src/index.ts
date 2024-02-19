import express, { Request, Response, NextFunction } from "express";
import path from "path";
import authRouter from "./routes/authRouter";
import { AppDataSource } from "../data-source";
import mediaRouter from "./routes/mediaRouter";
import https from "https";
import fs from "fs";

require('dotenv').config();
const app = express();

app.use(express.static(path.join(__dirname, "../../public")));
app.use(express.json());
app.use(authRouter);
app.use(mediaRouter);

AppDataSource.initialize().catch((error) => console.error('Error during Data Source initialization', error));

app.get("/*", (req: Request, res: Response, next: NextFunction): void => {
  try {
    res.sendFile(path.join(__dirname, '../../public/index.html'))
  } catch (error) {
    next(error);
  }
});

const PORT = 3000;

const options = {};

// Créer le serveur HTTPS avec les options SSL/TLS
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});