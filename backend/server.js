import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import authRoutes from "./routes/auth.js";
import contentRoutes from "./routes/content.js";
import uploadRoutes from "./routes/upload.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: true }));
app.use(express.json({ limit: '100mb' }));

app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/upload", uploadRoutes);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

import Content from "./models/Content.js";
import createAdmin from "./utils/createAdmin.js";

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");
    await createAdmin();
  })
  .catch(err => {
    console.error('❌ Mongo Error:');
    console.error(err.message);
  });

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'portfolio-cms',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    cloudinary: Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
    time: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Portfolio CMS Backend running on http://localhost:${PORT}`);
});
