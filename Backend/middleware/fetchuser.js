const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const fetchuser = (req, res, next) => {
  const token = req.header("authToken");
  if (!token) {
    res.status(401).json({ message: "Authentication token not sent" });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Authenticate with valid token" });
  }
};
module.exports = fetchuser;
