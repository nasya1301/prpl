
// src/api/router/auth/auth.router.js
import express from "express";
import { verifyAccessToken } from "../../middleware/auth.middleware.js";

export default function createAuthRouter(authHandler) {
  const router = express.Router();

  // Public routes
  router.post("/login", authHandler.login.bind(authHandler));
  router.post("/refresh", authHandler.refresh.bind(authHandler));

  // Protected routes
  router.get("/me", verifyAccessToken, authHandler.me.bind(authHandler));
  router.post("/logout", verifyAccessToken, authHandler.logout.bind(authHandler));

  return router;
}
