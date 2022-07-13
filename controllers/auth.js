const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Todo = require("../models/todo");
const { throwError } = require("../utils/error");

const accessTokenKey = "supersecret";
const refreshTokenKey = "supersupersecret";

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      return throwError("Validation error.", 400, errors.array());
    }

    const { name, email, password } = req.body;

    // check for user with same email
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      const data = { email: "Email already exist." };
      throwError("Email already exist.", 409, data);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const userResult = await user.save();

    // make todo after we get the generated id of user
    const todo = new Todo({
      name: "Monday Things",
      items: [],
      owner: userResult._id,
    });

    const todoResult = await todo.save();

    // push the generated id to todo array of user
    userResult.todo.push(todoResult._id);

    const finalUserResult = await userResult.save();

    // generate jwt, after register use this token to login
    const token = jwt.sign(
      {
        name: finalUserResult.name,
        userId: finalUserResult._id,
      },
      accessTokenKey,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign(
      {
        userId: finalUserResult._id,
      },
      refreshTokenKey,
      { expiresIn: "1d" }
    );

    // Assigning refresh token in http-only cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User created.",
      token: token,
      userName: finalUserResult.name,
    });
  } catch (err) {
    next(err);
  }
};

exports.signin = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      return throwError("Validation error.", 400, errors.array());
    }

    const email = req.body.email;
    const password = req.body.password;

    // check if email exist
    const user = await User.findOne({ email: email });
    if (!user) {
      const data = { email: "User with email doesn't exist." };
      throwError("User with email doesn't exist.", 404, data);
    }

    // compare password to hashedpassword
    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const data = { password: "Invalid password." };
      throwError("Invalid password.", 401, data);
    }

    // generate jwt
    const token = jwt.sign(
      {
        name: user.name,
        userId: user._id,
      },
      accessTokenKey,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign(
      {
        userId: user._id,
      },
      refreshTokenKey,
      { expiresIn: "1d" }
    );

    // Assigning refresh token in http-only cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res
      .status(202)
      .json({ message: "Login success.", token: token, userName: user.name });
  } catch (err) {
    next(err);
  }
};

exports.signout = async (req, res, next) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 1,
  });

  res.status(200).json({
    message: "Logout success.",
  });
};

exports.refresh = async (req, res, next) => {
  try {
    if (req.cookies?.jwt) {
      const refreshToken = req.cookies.jwt;
      decodedToken = jwt.verify(refreshToken, refreshTokenKey);

      if (!decodedToken) {
        throwError("Invalid Token", 403);
      }
      const user = await User.findById(decodedToken.userId);

      const accessToken = jwt.sign(
        {
          name: user.name,
          userId: user._id,
        },
        accessTokenKey,
        {
          expiresIn: "1d",
        }
      );

      res.status(200).json({
        message: "Token refreshed.",
        token: accessToken,
        userName: user.name,
      });
    } else {
      throwError("No cookie found.", 410);
    }
  } catch (err) {
    next(err);
  }
};
