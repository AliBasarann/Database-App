import express from "express";
import { config } from "dotenv";
config();
const app = express();
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App started at http://localhost:${port}`);
});