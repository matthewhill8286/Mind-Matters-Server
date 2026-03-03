import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import Stripe from "stripe";

export const config = {
  PORT: process.env.PORT || 4000,
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret-change-me",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
  NODE_ENV: process.env.NODE_ENV || "development",
};

export const stripe = new Stripe(config.STRIPE_SECRET_KEY);
