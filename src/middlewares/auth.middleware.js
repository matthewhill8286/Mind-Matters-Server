import { verifyToken } from "../utils/jwt";
export const authMiddleware = (req, res, next) => {
    const auth = req.headers["authorization"];
    if (auth?.startsWith("Bearer ")) {
        const token = auth.slice("Bearer ".length).trim();
        const sub = verifyToken(token);
        if (sub) {
            req.userId = sub;
            return next();
        }
    }
    // Fallback to x-user-id for legacy or default if needed
    // Note: For true "auth", we might want to return 401 if missing,
    // but keeping original behavior for now (default-user)
    req.userId = req.headers["x-user-id"] || "default-user";
    next();
};
export const getUserId = (req) => {
    return req.userId || "default-user";
};
