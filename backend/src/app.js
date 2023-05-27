import express from "express";
import { config } from "dotenv";
import { createTables, createTrigger } from "./utils/db.js";
import managerRoutes from "./routes/manager.routes.js";
import audienceRoutes from "./routes/audience.routes.js";
config();
const app = express();
app.use(express.json());

app.get('/',(req, res) => res.json({message: "Welcome!"}));
app.use("/manager", managerRoutes);
app.use("/audience", audienceRoutes);
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`App started at http://localhost:${port}`);
  createTables();
  createTrigger();
});