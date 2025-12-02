import { createRequestLogger, logInfo } from "../../common/logger/logger.js";
import crypto from "crypto";

/**
 * Assigns request_id if missing and attaches a per-request logger.
 * Also logs request completion, similar to Gin middleware.
 */
export function attachLogging() {
  return function (req, res, next) {
    // Generate or reuse request_id
    req.request_id = req.headers["x-request-id"] || crypto.randomUUID();
    res.setHeader("X-Request-Id", req.request_id);

    // Create per-request child logger
    const log = createRequestLogger(req);
    const start = process.hrtime.bigint();

    res.on("finish", () => {
      const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
      logInfo("Request completed", {
        status: res.statusCode,
        duration_ms: durationMs.toFixed(2),
        ip: req.ip,
      }, 1, log);
    });

    next();
  };
}
