const User = require("../models/UserModel");
const { validationResult } = require("express-validator");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// SIGNUP USER
exports.signUp = async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let success = false;
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success, message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    user = await User.create({ name, email, password: hashPassword });

    const data = { user: { id: user.id } };
    const authToken = jwt.sign(data, process.env.JWT_SECRET);
    success = true;
    return res.status(200).json({ success, authToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: "Internal Server Error" });
  }
};

// LOGIN USER
exports.login = async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let success = false;
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success, message: "Email does not exists !!!" });
    }

    const checkPass = await bcrypt.compare(password, user.password);
    if (!checkPass) {
      return res
        .status(400)
        .json({ success, message: "Incorrect Password !!!" });
    }

    const data = { user: { id: user.id } };
    const authToken = jwt.sign(data, process.env.JWT_SECRET);
    success = true;
    return res.status(200).json({ success, authToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: "Internal Server Error" });
  }
};
