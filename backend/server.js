import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: true }));
app.use(express.json({ limit: '50mb' }));

const contentSchema = new mongoose.Schema({}, { strict: false });
const Content = mongoose.model('Content', contentSchema);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.error("❌ Mongo Error:");
    console.error(err.message);
  });

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'portfolio-cms',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    time: new Date().toISOString()
  });
});

app.get('/api/content', async (req, res) => {
  const content = await Content.findOne({ type: 'portfolio' }).lean();
  res.json(content?.data || { empty: true });
});

app.put('/api/content', async (req, res) => {
  const data = req.body;

  if (!data || typeof data !== 'object') {
    return res.status(400).json({ error: 'Invalid portfolio content payload.' });
  }

  const updatedAt = new Date().toISOString();

  await Content.findOneAndUpdate(
    { type: 'portfolio' },
    { type: 'portfolio', data: { ...data, updatedAt } },
    { upsert: true, returnDocument: 'after' }
  );

  res.json({ success: true, updatedAt });
});

app.listen(PORT, () => {
  console.log(`Portfolio CMS Backend running on http://localhost:${PORT}`);
});