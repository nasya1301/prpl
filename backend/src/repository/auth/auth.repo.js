import { User } from "../../model/auth/auth.model.js";
import { logDebug, logError } from "../../common/logger/logger.js";

export class AuthRepository {
  constructor(db) {
    this.db = db; // pg Pool or Client
  }

  async getUserByUsername(username, log) {
    const query = `
      SELECT user_id, username, password_hash, full_name, role
      FROM users WHERE username = $1
    `;
    try {
      const { rows } = await this.db.query(query, [username]);
      if (rows.length === 0) {
        logDebug("No user found by username", { username, layer: "repository", operation: "getUserByUsername" }, log);
        return null;
      }

      logDebug("User retrieved successfully", { username, layer: "repository", operation: "getUserByUsername" }, log);
      return new User(rows[0]);
    } catch (err) {
      logError(err, "Failed to get user by username", {
        username,
        layer: "repository",
        operation: "getUserByUsername",
      }, log);
      throw err;
    }
  }

  async getUserByID(user_id, log) {
    const query = `
      SELECT user_id, username, password_hash, full_name, role
      FROM users WHERE user_id = $1
    `;
    try {
      const { rows } = await this.db.query(query, [user_id]);
      if (rows.length === 0) {
        logDebug("No user found by ID", { user_id, layer: "repository", operation: "getUserByID" }, log);
        return null;
      }

      logDebug("User retrieved successfully", { user_id, layer: "repository", operation: "getUserByID" }, log);
      return new User(rows[0]);
    } catch (err) {
      logError(err, "Failed to get user by ID", {
        user_id,
        layer: "repository",
        operation: "getUserByID",
      }, log);
      throw err;
    }
  }
}
