import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: true }));
app.use(express.json({ limit: '50mb' }));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const contentSchema = new mongoose.Schema({}, { strict: false });
const Content = mongoose.model('Content', contentSchema);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ Mongo Error:');
    console.error(err.message);
  });

app.post('/api/upload-image', async (req, res) => {
  try {
    const { image, folder = 'portfolio-cms' } = req.body || {};

    if (!image || typeof image !== 'string') {
      return res.status(400).json({ error: 'Image is required.' });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({ error: 'Cloudinary environment variables are missing.' });
    }

    const result = await cloudinary.uploader.upload(image, {
      folder,
      resource_type: 'image',
      transformation: [
        { width: 1400, height: 1400, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    });
  } catch (err) {
    console.error('❌ Cloudinary upload failed:', err.message);
    res.status(500).json({ error: 'Image upload failed.', details: err.message });
  }
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

app.get('/api/content', async (req, res) => {
  const content = await Content.findOne({ type: 'portfolio' }).lean();
  res.json(content?.data || { empty: true });
});

app.put('/api/content', async (req, res) => {
  try {
    const data = req.body;

    if (!data || typeof data !== 'object') {
      return res.status(400).json({ error: 'Invalid portfolio content payload.' });
    }

    const updatedAt = new Date().toISOString();

    const updated = await Content.findOneAndUpdate(
      { type: 'portfolio' },
      { type: 'portfolio', data: { ...data, updatedAt } },
      { upsert: true, returnDocument: 'after' }
    ).lean();

    res.json(updated?.data || { ...data, updatedAt });
  } catch (err) {
    console.error('❌ Content save failed:', err.message);
    res.status(500).json({ error: 'Failed to save content.', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Portfolio CMS Backend running on http://localhost:${PORT}`);
});
