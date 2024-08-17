import express from "express";
import { db } from "../config/firebase.js";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../middlewares/verifyToken.js";

const router = express();

router.post("/", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

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

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await addDoc(collection(db, "users"), {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    });

    res.status(200).json({ message: "User Registered Successfully." });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Failed to create user." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const usersRef = collection(db, "users");
    const userQuery = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(userQuery);

    // No matched email is found.
    if (querySnapshot.empty) {
      return res.status(403).json({ message: "Invalid Email." });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);

    if (!isPasswordCorrect) {
      return res.status(403).json({ message: "Incorrect Password." });
    }

    res.status(200).json({ message: "Login Successfully." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to login." });
  }
});

router.post("/verify", async (req, res) => {
  const { email, password } = req.body;

  try {
    const usersRef = collection(db, "users");
    const userQuery = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      return res.status(403).json({ message: "Invalid Email." });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);

    if (!isPasswordCorrect) {
      return res.status(403).json({ message: "Incorrect password." });
    }

    const payload = {
      id: userDoc.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profilePicture: userData.profilePicture,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
    res.status(200).json({ message: "Login Successfully.", token });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: "Failed to login." });
  }
});

export { router as userRouter };
