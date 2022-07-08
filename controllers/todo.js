const mongoose = require("mongoose");
const Todo = require("../models/todo");
const { throwError } = require("../utils/error");

exports.getTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({
      name: "Monday Things",
      owner: req.user._id,
    });
    if (!todo) {
      throwError("no todo found!", 404);
    }
    res.status(200).json(todo);
  } catch (err) {
    next(err);
  }
};

exports.addTask = async (req, res, next) => {
  const task = req.body.task;
  const status = req.body.status;
  const _id = new mongoose.Types.ObjectId();
  try {
    const todo = await Todo.findOne({
      name: "Monday Things",
      owner: req.user._id,
    });
    if (!todo) {
      const error = new Error("no todo found!");
      error.statusCode = 404;
      throw error;
    }
    todo.items.push({
      task: task,
      status: status,
      _id: _id,
    });
    const todoResult = await todo.save();
    res.status(201).json(todoResult);
  } catch (err) {
    next(err);
  }
};

exports.removeTask = async (req, res, next) => {
  const taskId = req.params.taskId;
  try {
    const todo = await Todo.findOne({
      name: "Monday Things",
      owner: req.user._id,
    });
    if (!todo) {
      const error = new Error("no todo found!");
      error.statusCode = 404;
      throw error;
    }
    todo.items = todo.items.filter(
      (item) => item._id.toString() !== taskId.toString()
    );
    const todoResult = await todo.save();
    res
      .status(202)
      .json({ message: "task removed successfully.", updatedTodo: todoResult });
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  const taskId = req.params.taskId;
  const updatedTask = req.body.task;
  const updatedStatus = req.body.status;
  try {
    const todo = await Todo.findOne({
      name: "Monday Things",
      owner: req.user._id,
    });
    if (!todo) {
      const error = new Error("no todo found!");
      error.statusCode = 404;
      throw error;
    }
    // update logic
    const itemIndex = todo.items.findIndex(
      (item) => item._id.toString() === taskId.toString()
    );
    if (itemIndex < 0) {
      const error = new Error("no item found!");
      error.statusCode = 404;
      throw error;
    }
    const item = todo.items[itemIndex];
    item.task = updatedTask || item.task;
    item.status = updatedStatus || item.status;
    const todoResult = await todo.save();
    res
      .status(202)
      .json({ message: "task updated successfully.", updatedTodo: todoResult });
  } catch (err) {
    next(err);
  }
};

exports.overwriteItems = async (req, res, next) => {
  const updatedItems = req.body.items;
  try {
    const todo = await Todo.findOne({
      name: "Monday Things",
      owner: req.user._id,
    });
    if (!todo) {
      const error = new Error("no todo found!");
      error.statusCode = 404;
      throw error;
    }
    // update logic
    todo.items = updatedItems;
    const todoResult = await todo.save();
    res.status(202).json({
      message: "items updated successfully.",
      updatedTodo: todoResult,
    });
  } catch (err) {
    next(err);
  }
};
