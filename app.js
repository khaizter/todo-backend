const express = require("express");
const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGO_DB_URI;

const bodyParser = require("body-parser");

const todoRoutes = require("./routes/todo");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    process.env.CORS_WHITELIST || "http://localhost:3000"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(cookieParser());

app.get("/", (req, res, next) => {
  return res.status(200).json({ message: "Hello index" });
});

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
