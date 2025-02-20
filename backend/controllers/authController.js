const AuthService = require("../services/authService");

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const result = await AuthService.register(email, password);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error("Registration error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt:", email);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const result = await AuthService.login(email, password);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { register, login };
