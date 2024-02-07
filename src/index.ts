import express, { Request, Response, NextFunction } from "express";
import path from "path";

const app = express();

app.use(express.static(path.join(__dirname, "../../public")));

console.log(__dirname)

app.get("/*", (req: Request, res: Response, next: NextFunction): void => {
  try {
    res.sendFile(path.join(__dirname, '../../public/index.html'))
  } catch (error) {
    next(error);
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});