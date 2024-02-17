require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const connectDB = require("./config/db.js");
const bodyParser = require("body-parser");
const cors = require("cors");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();

//? Cokkie Parser
app.use(cookieParser());

app.use(express.static("public"));

app.get("/extract-cookie", async (req, res) => {
  const cookie = req.cookies.refreshToken;

  res.status(200).json({
    cookie: cookie,
  });
});

app.use(express.json());

//? Connect DB
connectDB();

//? Import Route
const PostRoute = require("./routes/PostRoute");
const UserRoute = require("./routes/UserRoute");
const TokenRoute = require("./routes/TokenRoute");

//? Connect Port
app.listen(process.env.PORT, () => {
  console.log("Server started on port 5000");
});

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

//? Route Use
app.use(TokenRoute);
app.use(PostRoute);
app.use(UserRoute);

//? Verify User

//? Index Page

//? Function Registration User

//? Function Login User
