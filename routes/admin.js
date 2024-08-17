import express from "express";
import { db } from "../config/firebase.js";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  documentId,
  startAfter,
} from "firebase/firestore";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express();

router.get("/users", verifyToken, async (req, res) => {
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

router.get("/animals", verifyToken, async (req, res) => {
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

router.get("/trainings", verifyToken, async (req, res) => {
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

export { router as adminRouter };
