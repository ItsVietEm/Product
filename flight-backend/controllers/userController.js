const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../config/database");
const User = require("../models/user")(
  sequelize,
  require("sequelize").DataTypes
);

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, "your_secret_key", {
    expiresIn: "1h",
  });
};

const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use"}) ;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = generateToken(user);

    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Sign up failed:", error);
    res.status(500).json({ error: "Failed to sign up" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(`Login attempt for email: ${email}`);

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.status(200).json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login failed:", error);
    res
      .status(500)
      .json({ error: "Failed to login due to an internal server error" });
  }
};

module.exports = {
  signUp,
  login,
};
