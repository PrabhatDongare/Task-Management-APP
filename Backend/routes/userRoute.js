const express = require("express");
const router = express.Router();

const { signUp, login } = require("../controller/userController");
const { signupValidator, loginValidator } = require("../utils/validation");

router.post("/signUp", signupValidator, signUp);
router.post("/login", loginValidator, login);

module.exports = router;
