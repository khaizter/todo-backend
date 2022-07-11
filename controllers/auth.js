const User = require("../models/user");
const Todo = require("../models/todo");
const { throwError } = require("../utils/error");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      return throwError("validation Error", 400, errors.array());
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    // check for user with same email
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      const data = { email: "Email already exist." };
      throwError("Email already exist.", 400, data);
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

    res
      .status(200)
      .json({ message: "user created.", finalUserResult: finalUserResult });
  } catch (err) {
    next(err);
  }
};

exports.signin = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      return throwError("validation Error", 400, errors.array());
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
      const data = { password: "Invalid password" };
      throwError("Invalid password", 404, data);
    }

    // generate jwt
    const token = jwt.sign(
      {
        name: user.name,
        userId: user._id,
      },
      "supersecret",
      {
        expiresIn: "1h",
      }
    );

    res
      .status(200)
      .json({ message: "login success.", token: token, userName: user.name });
  } catch (err) {
    next(err);
  }
};
