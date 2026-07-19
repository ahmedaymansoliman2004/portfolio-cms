import express from "express";
import auth from "../middleware/auth.js";
import {
  uploadMedia,
  uploadImage,
  cloudinarySignature,
} from "../controllers/uploadController.js";

const router = express.Router();

router.post("/signature", auth, cloudinarySignature);

router.post("/media", auth, uploadMedia);

router.post("/image", auth, uploadImage);

export default router;