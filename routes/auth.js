const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth");

const { body } = require("express-validator");

const signupValidation = [
  body("name")
    .notEmpty()
    .withMessage("must not be empty")
    .isAlphanumeric()
    .withMessage("must be alpha numeric")
    .isLength({ min: 1, max: 15 })
    .withMessage("maximum of 15 characters"),
  body("email")
    .notEmpty()
    .withMessage("must not be empty")
    .isEmail()
    .withMessage("must be valid email"),
  body("password")
    .notEmpty()
    .withMessage("must not be empty")
    .isLength({ min: 4, max: 15 })
    .withMessage("must be 4-15 characters"),
];

const signinValidation = [
  body("email")
    .notEmpty()
    .withMessage("must not be empty")
    .isEmail()
    .withMessage("must be valid email"),
  body("password").notEmpty().withMessage("must not be empty"),
];

router.post("/signup", signupValidation, authController.signup);

router.post("/signin", signinValidation, authController.signin);

module.exports = router;
