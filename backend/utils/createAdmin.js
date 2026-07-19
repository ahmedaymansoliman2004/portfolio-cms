import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";

export default async function createAdmin() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error("Missing admin credentials.");
  }

  const exists = await Admin.findOne({ username });

  if (exists) {
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await Admin.create({
    username,
    passwordHash,
  });

  console.log("Admin account created.");
}