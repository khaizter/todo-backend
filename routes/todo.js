const express = require("express");

const router = express.Router();

const todoControllers = require("../controllers/todo");

const isAuth = require("../middleware/is-auth");

router.get("/", isAuth, todoControllers.getTodo);

// router.post("/add-task", isAuth, todoControllers.addTask);

// router.delete("/remove-task/:taskId", isAuth, todoControllers.removeTask);

// router.put("/update-task/:taskId", isAuth, todoControllers.updateTask);

// router.put("/overwrite-items", isAuth, todoControllers.overwriteItems); // endpoint for reordering items / clear complete

router.post("/save", isAuth, todoControllers.saveTodo);

module.exports = router;
