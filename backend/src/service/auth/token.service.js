import { RefreshToken } from "../../model/auth/auth.model.js";
import { logDebug, logError } from "../../common/logger/logger.js";
import { generateAccessToken, generateRefreshToken } from "../../../utils/auth.js";

export class RefreshTokenService {
  constructor(refreshTokenRepo, authRepo) {
    this.refreshTokenRepo = refreshTokenRepo;
    this.authRepo = authRepo;
  }

  async generateAccessAndRefreshToken(user_id, log) {
    try {
      const user = await this.authRepo.getUserByID(user_id, log);
      if (!user) {
        const err = new Error("User not found");
        logError(err, "Failed to find user for token generation", {
          user_id,
          layer: "service",
          operation: "generateAccessAndRefreshToken",
        }, log);
        throw err;
      }

      const accessToken = generateAccessToken(user);
      const refreshTokenStr = generateRefreshToken();

      const refreshToken = new RefreshToken({
        refresh_token: refreshTokenStr,
        user_id,
        expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        created_at: new Date(),
      });

      await this.refreshTokenRepo.storeRefreshToken(refreshToken, log);

      logDebug("Generated new access and refresh tokens", {
        user_id,
        layer: "service",
        operation: "generateAccessAndRefreshToken",
      }, log);

      return { accessToken, refreshToken: refreshTokenStr };
    } catch (err) {
      logError(err, "Failed to generate access/refresh token", {
        user_id,
        layer: "service",
        operation: "generateAccessAndRefreshToken",
      }, log);
      throw err;
    }
  }

  async validateAndReRefreshToken(token, log) {
    try {
      const valid = await this.refreshTokenRepo.getValidRefreshToken(token, log);
      if (!valid) {
        const err = new Error("Invalid refresh token");
        logError(err, "Refresh token invalid or expired", {
          token,
          layer: "service",
          operation: "validateAndReRefreshToken",
        }, log);
        throw err;
      }

      await this.refreshTokenRepo.revokeRefreshToken(token, log);

      const newPair = await this.generateAccessAndRefreshToken(valid.user_id);

      logDebug("Refreshed access/refresh token pair successfully", {
        user_id: valid.user_id,
        old_token: token,
        layer: "service",
        operation: "validateAndReRefreshToken",
      }, log);

      return newPair;
    } catch (err) {
      logError(err, "Failed to validate and refresh token", {
        token,
        layer: "service",
        operation: "validateAndReRefreshToken",
      }, log);
      throw err;
    }
  }

  async blacklistRefreshToken(token, log) {
    try {
      const valid = await this.refreshTokenRepo.getValidRefreshToken(token, log);
      if (!valid) {
        logDebug("No valid refresh token to revoke", {
          token,
          layer: "service",
          operation: "blacklistRefreshToken",
        }, log);
        return;
      }

      await this.refreshTokenRepo.revokeRefreshToken(token, log);

      logDebug("Refresh token revoked successfully", {
        token,
        layer: "service",
        operation: "blacklistRefreshToken",
      }, log);
    } catch (err) {
      logError(err, "Failed to blacklist refresh token", {
        token,
        layer: "service",
        operation: "blacklistRefreshToken",
      }, log);
      throw err;
    }
  }

  async blacklistTokensByUsername(username, log) {
    try {
      const user = await this.authRepo.getUserByUsername(username, log);
      if (!user) {
        logDebug("No user found for token blacklist", {
          username,
          layer: "service",
          operation: "blacklistTokensByUsername",
        }, log);
        return;
      }

      await this.refreshTokenRepo.revokeAllTokensByUserID(user.user_id, log);

      logDebug("All refresh tokens revoked for user", {
        username,
        user_id: user.user_id,
        layer: "service",
        operation: "blacklistTokensByUsername",
      }, log);
    } catch (err) {
      logError(err, "Failed to blacklist tokens by username", {
        username,
        layer: "service",
        operation: "blacklistTokensByUsername",
      }, log);
      throw err;
    }
  }
}
