import express, { Request, Response, NextFunction } from "express";
import path from "path";
import authRouter from "./routes/authRouter";
import { AppDataSource } from "../data-source";
import mediaRouter from "./routes/mediaRouter";
import https from "https";
import fs from "fs";

require('dotenv').config();
const app = express();
const http = require('http');

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

app.use((req, res, next) => {
  if (!req.secure) {
    return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }
  next();
});


const HTTP_PORT = 3080;
const HTTPS_PORT = 3000;

const options = {
  key: fs.readFileSync('./certificats/privkey.pem'),
  cert: fs.readFileSync('./certificats/fullchain.pem')
};

http.createServer(app).listen(HTTP_PORT, () => {
  console.log(`App listening on port ${HTTP_PORT}`);
});

// Créer le serveur HTTPS avec les options SSL/TLS
  https.createServer(options, app).listen(HTTPS_PORT, () => {
    console.log(`App listening on port ${HTTPS_PORT}`);
  });