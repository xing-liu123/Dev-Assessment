import express from "express";
import dotenv, { parse } from "dotenv";
import cors from "cors";
import { db } from "./config/firebase.js";
import { collection, addDoc } from "firebase/firestore";
import bcrypt from "bcrypt";

dotenv.config();
const app = express();
const APP_PORT = 5000;
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ Hello: "World", Version: 2 });
});

app.get("/api/health", (req, res) => {
  res.json({ "healthy:": true });
});

app.post("/api/user", async (req, res) => {
  const { firstName, lastName, email, password, profilePicture } = req.body;

  // Check if required fields present and validate types
  if (!firstName || typeof firstName !== "string") {
    return res.status(400).json({ message: "Invalid or missing first name." });
  }

  if (!lastName || typeof lastName !== "string") {
    return res.status(400).json({ message: "Invalid or missing last name." });
  }

  if (!email || typeof email !== "string") {
    return res.status(400).json({ message: "Invalid or missing email." });
  }

  if (!password || typeof password !== "string") {
    return res.status(400).json({ message: "Invalid or missing password." });
  }

  if (profilePicture !== undefined && typeof profilePicture !== "string") {
    return res.status(400).json({ message: "Invalid profile picture URL." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await addDoc(collection(db, "users"), {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      profilePicture: profilePicture || null,
    });

    res.status(200).json({ message: "User Registered Successfully." });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Failed to create user." });
  }
});

app.post("/api/animal", async (req, res) => {
  const { name, hoursTrained, owner, dateOfBirth, profilePicture } = req.body;

  // Check if required fields present and validate types
  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Invalid or missing name." });
  }

  if (!hoursTrained || typeof hoursTrained !== "number") {
    return res
      .status(400)
      .json({ message: "Invalid or missing hours trained." });
  }

  if (!owner || typeof owner !== "string") {
    return res.status(400).json({ message: "Invalid or missing owner ID." });
  }

  const dateObject = new Date(dateOfBirth);

  if (profilePicture !== undefined && typeof profilePicture !== "string") {
    return res.status(400).json({ message: "Invalid profile picture URL." });
  }

  try {
    await addDoc(collection(db, "animals"), {
      name: name,
      hoursTrained: hoursTrained,
      owner: owner,
      dateOfBirth: dateObject || null,
      profilePicture: profilePicture || null,
    });
    res.status(200).json({ message: "Animal Added Successfully." });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Failed to create animal." });
  }
});

app.post("/api/training", async (req, res) => {
  const { date, description, hours, animal, user, trainingLogVideo } = req.body;

  if (!date) {
    return res.status(400).json("Missing training date.");
  }

  if (!description || typeof description !== "string") {
    return res.status(400).json({ message: "Invalid or missing description." });
  }

  if (!hours || typeof hours !== "number") {
    return res
      .status(400)
      .json({ message: "Invalid or missing training hours." });
  }

  if (!animal || typeof animal !== "string") {
    return res.status(400).json({ message: "Invalid or missing animal ID." });
  }

  if (!user || typeof user !== "string") {
    return res.status(400).json({ message: "Invalid or missing user ID." });
  }

  if (trainingLogVideo !== undefined && typeof trainingLogVideo !== "string") {
    return res.status(400).json({ message: "Invalid video URL." });
  }

  const dateObject = new Date(date);

  try {
    await addDoc(collection(db, "trainings"), {
      date: dateObject,
      description: description,
      hours: hours,
      animal: animal,
      user: user,
      trainingLogVideo: trainingLogVideo || null,
    });
    res.status(200).json("Animal Successfully Trained.");
  } catch (error) {
    console.error("ERROR: ", error);
    res.status(500).json({ message: "Failed to train animal." });
  }
});

app.listen(APP_PORT, () => {
  console.log(`api listening at http://localhost:${APP_PORT}`);
});
