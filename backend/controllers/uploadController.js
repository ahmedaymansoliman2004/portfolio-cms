import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(dataUrl, folder = "portfolio-cms") {
  if (!dataUrl || typeof dataUrl !== "string") {
    const err = new Error("Media file is required.");
    err.status = 400;
    throw err;
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    const err = new Error(
      "Cloudinary environment variables are missing."
    );
    err.status = 500;
    throw err;
  }

  const isImage = dataUrl.startsWith("data:image/");

  const options = {
    folder,
    resource_type: "auto",
  };

  if (isImage) {
    options.transformation = [
      {
        width: 1400,
        height: 1400,
        crop: "limit",
      },
      {
        quality: "auto:good",
      },
      {
        fetch_format: "auto",
      },
    ];
  }

  return cloudinary.uploader.upload(dataUrl, options);
}

export async function cloudinarySignature(req, res) {
  try {
    const { folder = "portfolio-cms" } = req.body || {};

    const timestamp = Math.round(Date.now() / 1000);

    const paramsToSign = {
      folder,
      timestamp,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
      timestamp,
      signature,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Could not create Cloudinary signature.",
    });
  }
}

export async function uploadMedia(req, res) {
  try {
    const {
      media,
      image,
      folder = "portfolio-cms",
    } = req.body || {};

    const result = await uploadToCloudinary(
      media || image,
      folder
    );

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
  } catch (error) {
    console.error(error);

    res.status(error.status || 500).json({
      error: "Media upload failed.",
    });
  }
}

export async function uploadImage(req, res) {
  try {
    const {
      image,
      folder = "portfolio-cms",
    } = req.body || {};

    const result = await uploadToCloudinary(
      image,
      folder
    );

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
  } catch (error) {
    console.error(error);

    res.status(error.status || 500).json({
      error: "Image upload failed.",
    });
  }
}