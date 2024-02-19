const express = require("express");
const {
  signupUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");
const { checkAccessToken } = require("../middleware/checkAcessToken");
const multer = require("multer");
const path = require("path");
const {
  getOnlineUsers,
  followUser,
  checkFollow,
  countFollower,
  updateUser,
} = require("../controllers/userController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

const router = express.Router();

//? Login Route
router.post("/login", loginUser);

//? Sign Up Route
router.post("/signup", signupUser);

//? Logout Route
router.post("/logout", logoutUser);

//? Get Online User Route
router.get("/online-users", getOnlineUsers);

//? Update User
router.put(
  "/update-user/:userId",
  checkAccessToken,
  upload.single("profileImage"),
  updateUser
);

//? Following User
router.post("/follow/:userSlug", followUser);

//? Check is Following User
router.post("/checkFollow/:userSlug", checkFollow);

//? Count Follower
router.get("/countFollower/:userSlug", countFollower);

module.exports = router;
