import { logError, logDebug, logInfo } from "../../../common/logger/logger.js";

export class AuthHandler {
  constructor(authService) {
    this.authService = authService;
  }

  // POST /login
  async login(req, res) {
    const { username, password } = req.body;
    try {
      const log = req.log
      const { accessToken, refreshToken } = await this.authService.loginUser(username, password, log);

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      logInfo("Login successful", { username, layer: "handler", route: "POST /login" }, 5, req.log);
      return res.status(200).json({ message: "Login successful" });
    } catch (err) {
      logError(err, "Login failed", { username, layer: "handler", route: "POST /login" }, req.log);
      return res.status(401).json({ error: err.message || "Invalid credentials" });
    }
  }

  // POST /refresh
  async refresh(req, res) {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      logError(new Error("Missing refresh token"), "No refresh token found in cookies", {
        layer: "handler",
        route: "POST /refresh",
      }, req.log);
      return res.status(400).json({ error: "Missing refresh token" });
    }
    const log = req.log
    try {

      const { accessToken, refreshToken: newRefreshToken } =
        await this.authService.refreshUserToken(refreshToken, log);

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
      res.cookie("refresh_token", newRefreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      logInfo("Tokens refreshed successfully", { layer: "handler", route: "POST /refresh" }, 5, log);
      return res.status(200).json({ message: "Token refreshed successfully" });
    } catch (err) {
      logError(err, "Failed to refresh token", { layer: "handler", route: "POST /refresh" }, log);
      return res.status(401).json({ error: err.message || "Invalid refresh token" });
    }
  }

  // POST /logout
  async logout(req, res) {
    const refreshToken = req.cookies.refresh_token;
    const log = req.log
    try {
      if (refreshToken) {
        await this.authService.logoutUser(refreshToken, log);
        logInfo("User logged out and refresh token revoked", {
          layer: "handler",
          route: "POST /logout",
        }, 5, log);
      }

      res.clearCookie("access_token");
      res.clearCookie("refresh_token");

      return res.status(200).json({ message: "Logout successful" });
    } catch (err) {
      logError(err, "Failed to logout user", { layer: "handler", route: "POST /logout" }, log);
      return res.status(500).json({ error: "Logout failed" });
    }
  }

  // GET /me
  async me(req, res) {
    const log = req.log
    try {
      const user = req.user; // must be set by JWT middleware
      if (!user) {
        logError(new Error("Unauthorized"), "Missing authenticated user in request context", {
          layer: "handler",
          route: "GET /me",
        }, log);
        return res.status(401).json({ error: "Unauthorized" });
      }

      logInfo("User info fetched successfully", {
        username: user.username,
        user_id: user.user_id,
        layer: "handler",
        route: "GET /me",
      }, 5, log);
      return res.status(200).json({ user });
    } catch (err) {
      logError(err, "Failed to fetch user info", { layer: "handler", route: "GET /me" }, log);
      return res.status(500).json({ error: "Failed to fetch user info" });
    }
  }
}
