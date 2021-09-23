const { Router } = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const config = require("../config/default.json");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const router = Router();

/* /api/auth/register */
router.post(
  "/register",
  [
    check("email", "not correct email").isEmail(),
    check("password", "To short password min 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Wrong data for register",
        });
      }
      const { email, password } = req.body;

      const candidate = await User.findOne({ email });
      if (candidate) {
        return res.status(400).json({ message: "Email already Exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, password: hashedPassword });
      await user.save();

      res.status(201).json({ message: "User has been created" });
    } catch (e) {
      console.log(e.message);
      res.status(500).json({ message: "something goes wrong" });
    }
  }
);

/* /api/auth/login */
router.post(
  "/login",
  [
    check("email", "Enter correct Email").normalizeEmail().isEmail(),
    check("password", "Enter password").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Wrong login data",
        });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User doesn't exists" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          message: "Something goes wrong , check your user name and password",
        });
      }

      const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
        expiresIn: "1h",
      });

      res.json({ token, userId: user.id });
    } catch (e) {
      console.log(e.message);
      res.status(500).json({ message: "something goes wrong" });
    }
  }
);

module.exports = router;
