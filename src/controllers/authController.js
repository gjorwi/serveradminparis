const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email y contraseña son obligatorios" });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim(), isActive: true });

  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const validPassword = await user.comparePassword(password);

  if (!validPassword) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const token = generateToken(user);

  return res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

module.exports = { login, me };
