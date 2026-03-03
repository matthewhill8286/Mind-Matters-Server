import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

export const config = {
  PORT: process.env.PORT || 8787,
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret-change-me",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  NODE_ENV: process.env.NODE_ENV || "development",
};