const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  // ⭐ REQUIRED FOR VERCEL <-> RENDER COOKIE SHARING
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,        // Render uses HTTPS
    sameSite: "none",    // REQUIRED for cross-domain cookies
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(statusCode).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// ---------------- AUTH CONTROLLERS ----------------

exports.register = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    if (!name || !email || !password || !passwordConfirm) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Provide email & password" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0),
  });
  res.status(200).json({ success: true, message: "Logged out" });
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, user });
};
