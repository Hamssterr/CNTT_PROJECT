import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const generateToken = (userId, role, res) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("jwt", token, {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    httpOnly: true, // Prevents client-side JavaScript access
    secure: process.env.NODE_ENV !== "development", // Only send over HTTPS in production
    sameSite: "strict", // Mitigates CSRF attacks
    path: "/",
  });

  return token;
};

export const generateTokenForgotPassword = (email) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "10m", // Token expires in 10 minutes
  });

  return token;
};