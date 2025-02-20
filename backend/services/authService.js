const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserRepository = require("../repositories/userRepository");
const dotenv = require("../config/dotenv");

class AuthService {

  async register(email, password) {
    console.log("Registering user:", email);

    
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      return { error: "User already exists" };
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword);

    
    const newUser = await UserRepository.createUser(email, hashedPassword);

    
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, dotenv.jwtSecret, {
      expiresIn: "1h",
    });

    return { token, message: "User registered successfully!" };
  }


  async login(email, password) {
    console.log("Checking user:", email);

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      console.log("User not found");
      return { error: "Invalid email or password" };
    }

    console.log("User found, checking password...");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch");
      return { error: "Invalid email or password" };
    }

    const token = jwt.sign({ id: user._id, email: user.email }, dotenv.jwtSecret, {
      expiresIn: "1h",
    });

    console.log("Login successful!");
    return { token, message: "Login successful!" };
  }
}

module.exports = new AuthService();
