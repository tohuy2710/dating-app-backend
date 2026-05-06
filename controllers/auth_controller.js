const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.loginController = async ({ username, password }) => {
  const adminUser = process.env.SAMPLE_USERNAME;
  const adminPass = process.env.SAMPLE_PASSWORD;

  if (!username || !password) {
    return { status: 400, data: { message: "Missing username or password" } };
  }

  if (username !== adminUser || password !== adminPass) {
    return { status: 401, data: { message: "Invalid credentials" } };
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
  const token = jwt.sign(
    { role: "admin", username },
    process.env.JWT_SECRET,
    { expiresIn }
  );

  // decode to expose expiry info to clients
  const decoded = jwt.decode(token) || {};
  const exp = decoded.exp || null; // seconds since epoch
  const now = Math.floor(Date.now() / 1000);
  const expires_in = exp ? Math.max(0, exp - now) : null;
  const expires_at = exp ? new Date(exp * 1000).toISOString() : null;

  return {
    status: 200,
    data: {
      message: "Login successful",
      token: "Bearer " + token,
      token_type: 'Bearer',
      expires_in,
      expires_at,
    },
  };
};

exports.meController = async (decodedToken) => {
  return {
    status: 200,
    data: {
      message: "User info retrieved",
      user: {
        username: decodedToken.username,
        role: decodedToken.role,
      },
    },
  };
};

