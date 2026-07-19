import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import Admin from "../models/Admin.js";

export async function login(req, res) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid request.",
      });
    }

    const { username, password } = req.body;

    const admin = await Admin.findOne({
      username: username.toLowerCase(),
    }).select("+passwordHash");

    if (!admin) {
      return res.status(401).json({
        message: "Invalid credentials.",
      });
    }

    const isValid = await bcrypt.compare(
      password,
      admin.passwordHash
    );

    if (!isValid) {
      return res.status(401).json({
        message: "Invalid credentials.",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    return res.json({
      token,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
}