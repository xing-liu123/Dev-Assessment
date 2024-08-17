import express from "express";
import { db } from "../config/firebase.js";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express();

router.post("/", verifyToken, async (req, res) => {
  const { date, description, hours, animal } = req.body;

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

  const dateObject = new Date(date);

  try {
    const animalRef = doc(db, "animals", animal);
    const animalDoc = await getDoc(animalRef);

    if (!animalDoc.exists()) {
      return res.status(400).json({ message: "Animal doesn't exist." });
    }

    if (animalDoc.data().owner !== req.user.id) {
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
    });

    // Update the animal's total hours of training
    await updateDoc(animalRef, {
      hoursTrained: animalDoc.data().hoursTrained + hours,
    });

    res.status(200).json("Animal Successfully Trained.");
  } catch (error) {
    console.error("ERROR: ", error);
    res.status(500).json({ message: "Failed to train animal." });
  }
});

export { router as trainingRouter };
