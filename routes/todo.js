const express = require("express");

const router = express.Router();

const todoControllers = require("../controllers/todo");

router.get("/", todoControllers.getTodo);

router.post("/add-task", todoControllers.addTask);

router.delete("/remove-task/:taskId", todoControllers.removeTask);

router.put("/update-task/:taskId", todoControllers.updateTask);

router.put("/overwrite-items", todoControllers.overwriteItems); // endpoint for reordering items / clear complete

module.exports = router;
