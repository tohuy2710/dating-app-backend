const jwt = require("jsonwebtoken");

exports.verifyToken = (event) => {
  const headers = event.headers || {};
  const auth = headers.Authorization || headers.authorization;

  if (!auth || typeof auth !== 'string' || !auth.match(/^Bearer\s+/i)) {
    throw new Error("Missing or invalid token");
  }

  const token = auth.replace(/^Bearer\s+/i, "");
  // let jwt.verify throw TokenExpiredError or other errors up to caller
  return jwt.verify(token, process.env.JWT_SECRET);
};
