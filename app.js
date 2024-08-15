import express from "express";
import dotenv, { parse } from "dotenv";
import cors from "cors";
import { db } from "./config/firebase.js";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  documentId,
  startAfter,
  where,
} from "firebase/firestore";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
const APP_PORT = 5000;
app.use(cors({ origin: true }));
app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET || "thisisthekey";

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

app.post("/api/animal", verifyToken, async (req, res) => {
  const { name, hoursTrained, dateOfBirth, profilePicture } = req.body;

  // Check if required fields present and validate types
  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Invalid or missing name." });
  }

  if (!hoursTrained || typeof hoursTrained !== "number") {
    return res
      .status(400)
      .json({ message: "Invalid or missing hours trained." });
  }

  const dateObject = new Date(dateOfBirth);

  if (profilePicture !== undefined && typeof profilePicture !== "string") {
    return res.status(400).json({ message: "Invalid profile picture URL." });
  }
  
  try {
    await addDoc(collection(db, "animals"), {
      name: name,
      hoursTrained: hoursTrained,
      owner: req.user.id,
      dateOfBirth: dateObject || null,
      profilePicture: profilePicture || null,
    });
    res.status(200).json({ message: "Animal Added Successfully." });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Failed to create animal." });
  }
});

app.post("/api/training", verifyToken, async (req, res) => {
  const { date, description, hours, animal, trainingLogVideo } = req.body;

  // Check if required fields present and validate types
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

  if (trainingLogVideo !== undefined && typeof trainingLogVideo !== "string") {
    return res.status(400).json({ message: "Invalid video URL." });
  }

  const dateObject = new Date(date);

  try {
    const animalRef = doc(db, "animals", animal);
    const animalDoc = await getDoc(animalRef);

    if (!animalDoc.exists()) {
      return res.status(400).json({ message: "Animal doesn't exist." });
    }

    if (animalDoc.data().owner !== user) {
      return res
        .status(400)
        .json({ message: "Animal doesn't belong to the specific user." });
    }

    await addDoc(collection(db, "trainings"), {
      date: dateObject,
      description: description,
      hours: hours,
      animal: animal,
      user: req.user.id,
      trainingLogVideo: trainingLogVideo || null,
    });
    res.status(200).json("Animal Successfully Trained.");
  } catch (error) {
    console.error("ERROR: ", error);
    res.status(500).json({ message: "Failed to train animal." });
  }
});

app.get("/api/admin/users", verifyToken, async (req, res) => {
  try {
    const query_limit = parseInt(req.query.limit) || 10;
    const startAfterId = req.query.startAfterId;

    let queryRef = query(
      collection(db, "users"),
      orderBy(documentId()),
      limit(query_limit)
    );

    // If startAfterId is provided, fetch the document with the corresponding ID and update the query to start after this document.
    if (startAfterId) {
      const startAfterDoc = await getDoc(doc(db, "users", startAfterId));
      if (startAfterDoc.exists()) {
        queryRef = query(queryRef, startAfter(startAfterDoc));
      }
    }

    const userDocs = await getDocs(queryRef);

    // Map the fetched user documents, exclude the password field from the user data, and return the remaining data along with the document ID.
    const users = userDocs.docs.map((doc) => {
      const userData = doc.data();

      const { password, ...otherData } = userData;

      return {
        _id: doc.id,
        otherData,
      };
    });

    const lastVisible = userDocs.docs[userDocs.docs.length - 1];
    const nextStartAfterId = lastVisible ? lastVisible.id : null;

    res.status(200).json({ users, nextStartAfterId });
  } catch (error) {
    console.error("ERROR", error);
    res.status(500).json({ message: "Failed to fetch users." });
  }
});

app.get("/api/admin/animals", verifyToken, async (req, res) => {
  try {
    const query_limit = parseInt(req.query.limit) || 10;
    const startAfterId = req.query.startAfterId;

    let queryRef = query(
      collection(db, "animals"),
      orderBy(documentId()),
      limit(query_limit)
    );

    // If startAfterId is provided, fetch the document with the corresponding ID and update the query to start after this document.
    if (startAfterId) {
      const startAfterDoc = await getDoc(doc(db, "animals", startAfterId));
      if (startAfterDoc.exists()) {
        queryRef = query(queryRef, startAfter(startAfterDoc));
      }
    }

    const animalDocs = await getDocs(queryRef);

    // Map the fetched animal documents and return the data along with the document ID.
    const animals = animalDocs.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data(),
    }));

    const lastVisible = animalDocs.docs[animalDocs.docs.length - 1];
    const nextStartAfterId = lastVisible ? lastVisible.id : null;

    res.status(200).json({ animals, nextStartAfterId });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: "Failed to fetch animals." });
  }
});

app.get("/api/admin/trainings", verifyToken, async (req, res) => {
  try {
    const query_limit = parseInt(req.query.limit) || 10;
    const startAfterId = req.query.startAfterId;

    let queryRef = query(
      collection(db, "trainings"),
      orderBy(documentId()),
      limit(query_limit)
    );

    // If startAfterId is provided, fetch the document with the corresponding ID and update the query to start after this document.
    if (startAfterId) {
      const startAfterDoc = await getDoc(doc(db, "trainings", startAfterId));

      if (startAfterDoc.exists()) {
        queryRef = query(queryRef, startAfter(startAfterDoc));
      }
    }

    const trainingDocs = await getDocs(queryRef);

    // Map the fetched training documents and return the data along with the document ID.
    const trainings = trainingDocs.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data(),
    }));

    const lastVisible = trainingDocs.docs[trainingDocs.docs.length - 1];
    const nextStartAfterId = lastVisible ? lastVisible.id : null;

    res.status(200).json({ trainings, nextStartAfterId });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: "Failed to fetch training logs." });
  }
});

app.post("/api/user/login", async (req, res) => {
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

app.post("/api/user/verify", async (req, res) => {
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

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token is provided." });
  }

  // Assume client uses Bearer + <token>
  try {
    const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Failed to authenticate token." });
  }
}

app.listen(APP_PORT, () => {
  console.log(`api listening at http://localhost:${APP_PORT}`);
});
