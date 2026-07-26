import express from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.middleware.js";

import {
  uploadMedia,
  uploadImage,
  cloudinarySignature,
} from "../controllers/uploadController.js";

const router = express.Router();

router.post("/signature", auth, cloudinarySignature);

router.post("/media", auth, uploadMedia);

router.post(
  "/image",
  auth,
  upload.single("file"),
  uploadImage
);

export default router;