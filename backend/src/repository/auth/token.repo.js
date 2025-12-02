import { RefreshToken } from "../../model/auth/auth.model.js";
import { logDebug, logError } from "../../common/logger/logger.js";

export class RefreshTokenRepository {
  constructor(db) {
    this.db = db;
  }

  async storeRefreshToken(refreshToken, log) {
    const query = `
      INSERT INTO refresh_tokens (refresh_token, expiry, user_id)
      VALUES ($1, $2, $3)
      RETURNING refresh_token_id
    `;
    const params = [
      refreshToken.refresh_token,
      refreshToken.expiry,
      refreshToken.user_id,
    ];

    try {
      const { rows } = await this.db.query(query, params);
      refreshToken.refresh_token_id = rows[0].refresh_token_id;

      logDebug("Refresh token stored successfully", {
        user_id: refreshToken.user_id,
        token_id: refreshToken.refresh_token_id,
        layer: "repository",
        operation: "storeRefreshToken",
      }, log);

      return refreshToken;
    } catch (err) {
      logError(err, "Failed to store refresh token", {
        user_id: refreshToken.user_id,
        layer: "repository",
        operation: "storeRefreshToken",
      }, log);
      throw err;
    }
  }

  async getValidRefreshToken(token, log) {
    const query = `
      SELECT refresh_token_id, refresh_token, expiry, user_id, created_at, revoked
      FROM refresh_tokens
      WHERE refresh_token = $1 AND revoked = FALSE AND expiry > NOW()
    `;
    try {
      const { rows } = await this.db.query(query, [token]);
      if (rows.length === 0) {
        logDebug("No valid refresh token found", {
          token,
          layer: "repository",
          operation: "getValidRefreshToken",
        }, log);
        return null;
      }

      logDebug("Valid refresh token retrieved successfully", {
        token_id: rows[0].refresh_token_id,
        user_id: rows[0].user_id,
        layer: "repository",
        operation: "getValidRefreshToken",
      }, log);

      return new RefreshToken(rows[0]);
    } catch (err) {
      logError(err, "Failed to fetch valid refresh token", {
        token,
        layer: "repository",
        operation: "getValidRefreshToken",
      }, log);
      throw err;
    }
  }

  async revokeRefreshToken(token, log) {
    const query = `
      UPDATE refresh_tokens
      SET revoked = TRUE
      WHERE refresh_token = $1 AND revoked = FALSE AND expiry > NOW()
    `;
    try {
      const result = await this.db.query(query, [token]);
      logDebug("Refresh token revoked", {
        token,
        affected_rows: result.rowCount,
        layer: "repository",
        operation: "revokeRefreshToken",
      }, log);
    } catch (err) {
      logError(err, "Failed to revoke refresh token", {
        token,
        layer: "repository",
        operation: "revokeRefreshToken",
      }, log);
      throw err;
    }
  }

  async revokeAllTokensByUserID(user_id, log) {
    const query = `
      UPDATE refresh_tokens
      SET revoked = TRUE
      WHERE user_id = $1 AND revoked = FALSE AND expiry > NOW()
    `;
    try {
      const result = await this.db.query(query, [user_id]);
      logDebug("All refresh tokens revoked for user", {
        user_id,
        affected_rows: result.rowCount,
        layer: "repository",
        operation: "revokeAllTokensByUserID",
      }, log);
    } catch (err) {
      logError(err, "Failed to revoke all refresh tokens for user", {
        user_id,
        layer: "repository",
        operation: "revokeAllTokensByUserID",
      }, log);
      throw err;
    }
  }
}
