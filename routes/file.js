import express from "express";
import multer from "multer";
import { db, storage } from "../config/firebase.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express();
const upload = multer({ memory: true });

router.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const { dataType, id } = req.body;

    if (!dataType || !id) {
      return res.status(400).json({ message: "Missing data type or id." });
    }

    let fieldToUpdate;
    let collectionName;

    switch (dataType) {
      case "user":
        fieldToUpdate = "profilePicture";
        collectionName = "users";
        break;
      case "animal":
        fieldToUpdate = "profilePicture";
        collectionName = "animals";
        break;
      case "training":
        fieldToUpdate = "trainingLogVideo";
        collectionName = "trainings";
        break;
      default:
        return res.status(500).json({ message: "Invalid dataType." });
    }

    const fileRef = ref(storage, `${dataType}/${id}/${req.file.originalname}`);

    const snapshot = await uploadBytes(fileRef, req.file.buffer);
    const downloadURL = await getDownloadURL(snapshot.ref);

    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      [fieldToUpdate]: downloadURL,
    });

    res
      .status(200)
      .json({ message: "File uploaded successfully.", fileUrl: downloadURL });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: "Failed to upload file" });
  }
});

export { router as fileRouter };
