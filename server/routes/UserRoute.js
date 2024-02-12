const express = require("express");
const {
  signupUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");

/* const renewAccessToken = require("../middleware/refreshToken"); */

const router = express.Router();

//? Refresh Token Route
/* router.get("/refresh", renewAccessToken); */

//? Login Route
router.post("/login", loginUser);

//? Sign Up Route
router.post("/signup", signupUser);

//? Logout Route
router.post("/logout", logoutUser);

module.exports = router;
