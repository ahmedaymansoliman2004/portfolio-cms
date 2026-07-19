import Content from "../models/Content.js";

export async function getContent(req, res) {
  try {
    const content = await Content.findOne({ type: "portfolio" }).lean();
    res.json(content?.data || { empty: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to load content.",
    });
  }
}

export async function updateContent(req, res) {
  try {
    const data = req.body;

    if (!data || typeof data !== "object") {
      return res.status(400).json({
        error: "Invalid portfolio content payload.",
      });
    }

    const updatedAt = new Date().toISOString();

    const updated = await Content.findOneAndUpdate(
      { type: "portfolio" },
      {
        type: "portfolio",
        data: {
          ...data,
          updatedAt,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    ).lean();

    return res.json(updated?.data || { ...data, updatedAt });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to save content.",
    });
  }
}