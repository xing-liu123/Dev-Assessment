import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { userRouter } from "./routes/user.js";
import { adminRouter } from "./routes/admin.js";
import { animalRouter } from "./routes/animal.js";
import { trainingRouter } from "./routes/training.js";
import { fileRouter } from "./routes/file.js";

dotenv.config();
const app = express();
const APP_PORT = 5000;

app.use(cors({ origin: true }));
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/animal", animalRouter);
app.use("/api/training", trainingRouter);
app.use("/api/file", fileRouter);

app.get("/", (req, res) => {
  res.json({ Hello: "World", Version: 2 });
});

app.get("/api/health", (req, res) => {
  res.json({ "healthy:": true });
});

app.listen(APP_PORT, () => {
  console.log(`api listening at http://localhost:${APP_PORT}`);
});
