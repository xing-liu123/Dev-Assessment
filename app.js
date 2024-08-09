import express from "express";
import dotenv from "dotenv";
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

  // Check if required fields present
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Check types
  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    (profilePicture !== undefined && typeof profilePicture !== "string")
  ) {
    return res.status(400).json({ message: "Invalid data types" });
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

    res.status(200).json({ message: "User Registered Successfully" });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Failed to create user" });
  }
});

app.post("/api/animal", async (req, res) => {
  const { name, hoursTrained, owner, dataOfBirth, profilePicture } = req.body;
});

app.listen(APP_PORT, () => {
  console.log(`api listening at http://localhost:${APP_PORT}`);
});
