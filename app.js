const express = require("express");
const mongoose = require("mongoose");
const MONGODB_URI =
  "mongodb+srv://khaizter:garena123@cluster0.5ojbmh3.mongodb.net/todo?retryWrites=true&w=majority";

const bodyParser = require("body-parser");
const todoRoutes = require("./routes/todo");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/todo", todoRoutes);

app.use((error, req, res, next) => {
  let { statusCode, message, data } = error;
  if (!statusCode) {
    statusCode = 500;
  }
  res.status(statusCode).json({ message: message, data: data });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
