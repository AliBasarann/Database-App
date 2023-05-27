import express from "express";
import { config } from "dotenv";
import { createTables, createTrigger } from "./utils/db.js";
import managerRoutes from "./routes/manager.routes.js";
import audienceRoutes from "./routes/audience.routes.js";
import directorRoutes from "./routes/director.routes.js"
import cors from "cors";
config();
const app = express();
app.use(express.json());
app.use(cors());
app.get('/',(req, res) => res.json({message: "Welcome!"}));
app.use("/manager", managerRoutes);
app.use("/audience", audienceRoutes);
app.use("/director", directorRoutes);
const port = process.env.PORT || 8080;
app.listen(port, async () => {
  console.log(`App started at http://localhost:${port}`);
  await createTables();
  await createTrigger();
});