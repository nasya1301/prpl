export class User {
  constructor({
    user_id = null,
    username = null,
    email = null,
    password_hash = null,
    role = null,
    reset_token = null,
    reset_token_expiry = null,
  } = {}) {
    this.user_id = user_id;
    this.username = username;
    this.email = email;
    this.password_hash = password_hash;
    this.role = role;
    this.reset_token = reset_token;
    this.reset_token_expiry = reset_token_expiry;
  }

  // Optional: utility to serialize for response (strip sensitive info)
  toJSON() {
    return {
      user_id: this.user_id,
      username: this.username,
      email: this.email,
      role: this.role,
      reset_token: this.reset_token,
      reset_token_expiry: this.reset_token_expiry,
    };
  }
}

export class RefreshToken {
  constructor({
    refresh_token_id = null,
    refresh_token = null,
    expiry = null,
    user_id = null,
    created_at = new Date(),
    revoked = false,
  } = {}) {
    this.refresh_token_id = refresh_token_id;
    this.refresh_token = refresh_token;
    this.expiry = expiry;
    this.user_id = user_id;
    this.created_at = created_at;
    this.revoked = revoked;
  }
}

