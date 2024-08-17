import express from "express";
import { db } from "../config/firebase.js";
import { collection, addDoc } from "firebase/firestore";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express();

router.post("/", verifyToken, async (req, res) => {
  const { name, hoursTrained, dateOfBirth } = req.body;

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

  try {
    await addDoc(collection(db, "animals"), {
      name: name,
      hoursTrained: hoursTrained,
      owner: req.user.id,
      dateOfBirth: dateObject || null,
    });
    res.status(200).json({ message: "Animal Added Successfully." });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Failed to create animal." });
  }
});

export { router as animalRouter };
