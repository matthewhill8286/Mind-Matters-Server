import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
export const signToken = (userId) => jwt.sign({ sub: userId }, config.JWT_SECRET, { expiresIn: "7d" });
export const verifyToken = (token) => {
    try {
        const payload = jwt.verify(token, config.JWT_SECRET);
        return payload?.sub;
    }
    catch {
        return null;
    }
};
