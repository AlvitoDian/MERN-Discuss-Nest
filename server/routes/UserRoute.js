const express = require("express");
const {
  signupUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");

const {
  getOnlineUsers,
  followUser,
  checkFollow,
  countFollower,
} = require("../controllers/userController");

const router = express.Router();

//? Login Route
router.post("/login", loginUser);

//? Sign Up Route
router.post("/signup", signupUser);

//? Logout Route
router.post("/logout", logoutUser);

//? Get Online User Route
router.get("/online-users", getOnlineUsers);

//? Following User
router.post("/follow/:userId", followUser);

//? Check is Following User
router.post("/checkFollow/:userId", checkFollow);

//? Count Follower
router.get("/countFollower/:userId", countFollower);

module.exports = router;
