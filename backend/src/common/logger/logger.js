import pino from "pino";
import crypto from "crypto";
import path from "path";

let appLogger;
let errorLogger;

/**
 * Initialize base loggers (stdout + stderr)
 */
export function initLogger(serviceName = "backend-api", isProduction = false) {
  const level = isProduction ? "info" : "debug";

  appLogger = pino({
    level,
    base: { service: serviceName },
    timestamp: pino.stdTimeFunctions.isoTime,
  }, pino.destination(1));

  errorLogger = pino({
    level: "error",
    base: { service: serviceName },
    timestamp: pino.stdTimeFunctions.isoTime,
  }, pino.destination(2));
}

/**
 * Return base (non-request-scoped) logger
 */
export function getLogger() {
  if (!appLogger) {
    initLogger("backend-api", process.env.NODE_ENV === "production");
  }
  return appLogger;
}

/**
 * Extract caller metadata: function, file, line
 */
function getCallerMeta(depth = 2) {
  const err = new Error();
  const stack = err.stack?.split("\n")[depth + 1] || "";
  const match = stack.match(/at (.*?) \((.*?):(\d+):\d+\)/);
  if (match) {
    const [, fn, file, line] = match;
    return { function: fn, file: path.basename(file), line: parseInt(line, 10) };
  }
  return {};
}

/**
 * Debug logging (with optional request logger)
 */
export function logDebug(message, fields = {}, reqLog = null) {
  const meta = getCallerMeta(2);
  const logger = reqLog || getLogger();
  logger.debug({ ...meta, log_type: "debug", ...fields }, message);
}

/**
 * Error logging (with optional request logger)
 */
export function logError(err, message, fields = {}, reqLog = null) {
  const meta = getCallerMeta(2);
  const logger = reqLog || errorLogger || getLogger();
  logger.error({ ...meta, error: err?.message, stack: err?.stack, ...fields }, message);
}

/**
 * Info logging with probabilistic sampling
 */
export function logInfo(message, fields = {}, sampleRate = 1, reqLog = null) {
  if (sampleRate > 1 && Math.floor(Math.random() * sampleRate) !== 0) return;
  const meta = getCallerMeta(2);
  const logger = reqLog || getLogger();
  logger.info({ ...meta, log_type: "info", ...fields }, message);
}

/**
 * Create a new per-request child logger
 */
export function createRequestLogger(req, baseLogger = getLogger()) {
  const requestId = req.request_id || crypto.randomUUID();
  req.request_id = requestId;
  const child = baseLogger.child({
    request_id: requestId,
    method: req.method,
    path: req.originalUrl || req.url,
  });
  req.log = child; // attach to req for use downstream
  return child;
}

export default {
  initLogger,
  getLogger,
  createRequestLogger,
  logDebug,
  logInfo,
  logError,
};
