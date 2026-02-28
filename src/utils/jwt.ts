import jwt from "jsonwebtoken";
import { config } from "../config";

export const signToken = (userId: string) =>
  jwt.sign({ sub: userId }, config.JWT_SECRET, { expiresIn: "7d" });

export const verifyToken = (token: string) => {
  try {
    const payload = jwt.verify(token, config.JWT_SECRET) as { sub?: string };
    return payload?.sub;
  } catch {
    return null;
  }
};
