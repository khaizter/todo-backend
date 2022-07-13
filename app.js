const express = require("express");
const mongoose = require("mongoose");
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.5ojbmh3.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;

const bodyParser = require("body-parser");

const todoRoutes = require("./routes/todo");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");

const app = express();

app.use(bodyParser.json());

console.log(process.env.CORS_WHITELIST);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CORS_WHITELIST);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(cookieParser());

app.use("/todo", todoRoutes);
app.use("/auth", authRoutes);

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
    app.listen(process.env.PORT || 8080);
  })
  .catch((err) => {
    console.log(err);
  });
