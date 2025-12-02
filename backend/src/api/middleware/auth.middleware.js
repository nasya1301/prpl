
// middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import { logError } from "../../common/logger/logger.js";

export function verifyAccessToken(req, res, next) {
  const token =
    req.cookies?.access_token ||
    req.headers["authorization"]?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = decoded; // attach decoded user to request
    next();
  } catch (err) {
    logError(err, "Invalid or expired JWT", { route: req.path });
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}
