import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: true }));
app.use(express.json({ limit: '80mb' }));

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

async function uploadToCloudinary(dataUrl, folder = 'portfolio-cms') {
  if (!dataUrl || typeof dataUrl !== 'string') {
    const err = new Error('Media file is required.');
    err.status = 400;
    throw err;
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    const err = new Error('Cloudinary environment variables are missing.');
    err.status = 500;
    throw err;
  }

  const isImage = dataUrl.startsWith('data:image/');
  const options = {
    folder,
    resource_type: 'auto',
  };

  if (isImage) {
    options.transformation = [
      { width: 1400, height: 1400, crop: 'limit' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ];
  }

  return cloudinary.uploader.upload(dataUrl, options);
}

app.post('/api/upload-media', async (req, res) => {
  try {
    const { media, image, folder = 'portfolio-cms' } = req.body || {};
    const result = await uploadToCloudinary(media || image, folder);

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      duration: result.duration,
    });
  } catch (err) {
    console.error('❌ Cloudinary media upload failed:', err.message);
    res.status(err.status || 500).json({ error: 'Media upload failed.', details: err.message });
  }
});

// Backward compatibility for old dashboard code.
app.post('/api/upload-image', async (req, res) => {
  try {
    const { image, folder = 'portfolio-cms' } = req.body || {};
    const result = await uploadToCloudinary(image, folder);

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      duration: result.duration,
    });
  } catch (err) {
    console.error('❌ Cloudinary image upload failed:', err.message);
    res.status(err.status || 500).json({ error: 'Image upload failed.', details: err.message });
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
