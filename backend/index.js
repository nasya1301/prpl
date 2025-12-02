import express from "express";
import cookieParser from "cookie-parser";
import http from "http";
import cors from "cors";
import { Pool } from "pg";
import logger from "./src/common/logger/logger.js";
import { attachLogging } from "./src/api/middleware/logging.middleware.js";
import { securityHeaders } from "./src/api/middleware/security-header.middleware.js";
import { rateLimiter } from "./src/api/middleware/rate-limit.middleware.js";
import { initializeRoutes } from "./src/api/router/container.router.js";
import { createContainerHandler } from "./src/api/handler/container.handler.js";
import "dotenv/config";

async function main() {
  const isProduction = process.env.NODE_ENV === "production";
  logger.initLogger("backend-api", isProduction);
  const pool = new Pool({
    connectionString: process.env.DB_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  try {
    await pool.query("SELECT 1");
  } catch (err) {
    logger.logError(err, "Failed to connect to DB on startup");
    process.exit(1);
  }

  const app = express();
  app.use(express.json({ limit: "28mb" }));
  app.use(express.urlencoded({ extended: true, limit: "28mb" }));
  app.use(cookieParser());
  app.use(attachLogging());
  app.use(securityHeaders);

  const corsUrls = process.env.CORS_URL || "";
  const allowedOrigins = corsUrls
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  app.use(
    cors(
      allowedOrigins.length > 0
        ? {
            origin: allowedOrigins,
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true,
            exposedHeaders: ["Content-Length", "Authorization", "Content-Type"],
            maxAge: 12 * 60 * 60,
          }
        : {}
    )
  );

  app.use(rateLimiter);

  let allHandlers;
  try {
    allHandlers = await createContainerHandler(pool);
  } catch (err) {
    logger.logError({ err }, "Failed to initialize handlers");
    process.exit(1);
  }

  initializeRoutes(app, allHandlers);

  app.use((_, res) => res.status(404).json({ message: "Not Found" }));
  app.use((err, req, res, next) => {
    (req.log || logger).logError({ err }, "Unhandled error");
    res.status(500).json({ error: err.message || "Internal Server Error" });
  });

  const port = parseInt(process.env.PORT, 10) || 3000;
  const server = http.createServer(app);

  server.listen(port, () => logger.logInfo(`Server listening on port ${port}`));

  const shutdown = () => {
    logger.logInfo("Received shutdown signal, closing server...");
    server.close(async (err) => {
      if (err) {
        logger.logError({ err }, "Error during server close");
        process.exit(1);
      }
      try {
        await pool.end();
        logger.logInfo("Database pool closed");
      } catch (dbErr) {
        logger.logInfo({ dbErr }, "Error closing DB pool");
      }
      logger.logInfo("Shutdown complete");
      process.exit(0);
    });
    setTimeout(() => {
      logger.logError("Forcing shutdown after timeout");
      process.exit(1);
    }, 10_000);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("Failed to start application", err);
  process.exit(1);
});
