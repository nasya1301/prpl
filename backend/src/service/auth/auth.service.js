import { logError, logDebug, logInfo } from "../../common/logger/logger.js";
import { comparePasswords } from "../../../utils/auth.js";
export class AuthService {
  constructor(authRepo, tokenService) {
    this.authRepo = authRepo;
    this.tokenService = tokenService;
  }

  async loginUser(username, password, log) {
    try {
      const user = await this.authRepo.getUserByUsername(username, log);
      if (!user) throw new Error("User not found");

      const match = await comparePasswords(password, user.password_hash);
      if (!match) throw new Error("Invalid credentials");

      const tokens = await this.tokenService.generateAccessAndRefreshToken(user.user_id, log);
      return tokens;
    } catch (err) {
      logError(err, "Failed to login user", { layer: "service", operation: "loginUser" }, log);
      throw err; // Let handler decide HTTP code
    }
  }

  async logoutUser(refreshToken, log) {
    try {
      await this.tokenService.blacklistRefreshToken(refreshToken, log);
    } catch (err) {
      logError(err, "Failed to logout user", { layer: "service", operation: "logoutUser" }, log);
      throw err;
    }
  }

  async refreshUserToken(refreshToken, log) {
    try {
      return await this.tokenService.validateAndReRefreshToken(refreshToken, log);
    } catch (err) {
      logError(err, "Failed to refresh user token", { layer: "service", operation: "refreshUserToken" }, log);
      throw err;
    }
  }
}
