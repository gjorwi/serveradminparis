const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../models/User");

async function auth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "No autorizado" });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Sesión inválida" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
}

module.exports = auth;
