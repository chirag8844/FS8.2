// Import dependencies
const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Secret key for signing JWTs
const SECRET_KEY = "mysecretkey123"; // (In real apps, use environment variables)

// Hardcoded user (for demo)
const user = {
  id: 1,
  username: "testuser",
  password: "password123"
};

// ✅ Login Route — Issues JWT if credentials match
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validate user
  if (username === user.username && password === user.password) {
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

// ✅ Middleware to verify token
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
}

// ✅ Protected Route
app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Access granted!", user: req.user });
});

// Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
