const express = require("express");
const {
  getAllPost,
  addPost,
  getPostBySlug,
} = require("../controllers/postController");
const { getUserById } = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");
const { checkAccessToken } = require("../middleware/checkAcessToken");
const jwt = require("jsonwebtoken");

const router = express.Router();

//? GET all Posts
router.get("/posts", getAllPost);

//? POST a new Post
router.post("/add-post", checkAccessToken, addPost);

//? GET a single Post
router.get("/post/:slug", getPostBySlug);

//? GET a sing user profile
router.get("/user/:id", getUserById);

//? UPDATE a Post

//? DELETE a Post

module.exports = router;
