const express = require("express");
const router = express.Router();
const passport = require("passport");
const authenticateToken = require("../authenticateToken");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const async = require("async");
const User = require("../models/User");

router.get("/test", (req, res) => {
  res.json({ message: "this is a prototype" });
});

router.get("/user", authenticateToken, (req, res) => {
  res.json({
    username: req.user.username,
    _id: req.user._id,
  });
});

router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user) {
    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting authentication status
    if (!user) {
      return res.json({
        message: "Invalid credentials",
      });
    }
    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
      const accessToken = jwt.sign(
        JSON.parse(JSON.stringify(user)),
        process.env.ACCESS_TOKEN_SECRET,
      );
      return res.json({
        accessToken,
      });
    });
  })(req, res, next);
});

router.post("/signup", [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Username is required")
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .escape(),
  body("confirm-password")
    .trim()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords must match")
    .escape(),
  (req, res, next) => {
    var errors = validationResult(req);
    var errorsArray = errors.array().map((error) => error.msg);

    User.findOne({ username: req.body.username }).exec((err, result) => {
      if (err) {
        return next(err);
      }
      if (result) {
        errorsArray.push("Username must be unique");
      }

      if (errorsArray.length > 0) {
        return res.json({
          errors: errorsArray,
        });
      }

      // passed validation
      bcrypt.hash(req.body.password, 10, (err, hashedPass) => {
        if (err) {
          return next(err);
        }
        const user = new User({
          username: req.body.username,
          password: hashedPass,
        });
        user.save((err) => {
          if (err) {
            return next(err);
          }
          req.login(user, (err) => {
            if (err) {
              return next(err);
            }
            const accessToken = jwt.sign(
              { _id: user._id, username: user.username },
              process.env.ACCESS_TOKEN_SECRET,
            );
            res.json({ accessToken });
          });
        });
      });
    });
  },
]);

router.delete("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.cookie("isAuthenticated", false);
    res.json({ message: "Logged out successfully" });
  });
});

module.exports = router;
