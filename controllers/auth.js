const User = require("../models/user");
const Todo = require("../models/todo");
const { throwError } = require("../utils/error");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    // check for user with same email
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      console.log(existingUser);
      throwError("Email already exist.", 400);
    }

    const user = new User({
      name: name,
      email: email,
      password: password,
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
  const email = req.body.email;
  const password = req.body.password;
  try {
    // check if email exist
    const user = await User.findOne({ email: email });
    if (!user) {
      throwError("User with email doesn't exist.", 404);
    }
    if (password !== user.password) {
      throwError("Invalid password", 404);
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

    res.status(200).json({ message: "login success.", token: token });
  } catch (err) {
    next(err);
  }
};
