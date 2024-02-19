const express = require("express");
const {
  getAllPost,
  getAllPostByUser,
  addPost,
  getPostBySlug,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const {
  getAllComment,
  addComment,
} = require("../controllers/commentController");
const { getUserBySlug } = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");
const { checkAccessToken } = require("../middleware/checkAcessToken");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

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

//? GET all Posts
router.get("/posts", getAllPost);

//? POST a new Post
router.post("/add-post", checkAccessToken, upload.single("postImage"), addPost);

//? GET a single Post
router.get("/post/:slug", getPostBySlug);

//? GET a sing user profile
router.get("/user/:slug", getUserBySlug);

//? GET all post with by current user
router.get("/posts-user/:userSlug", getAllPostByUser);

//? UPDATE a Post
router.put(
  "/update-post/:userId",
  checkAccessToken,
  upload.single("postImage"),
  updatePost
);

//? DELETE a Post
router.delete("/delete-post/:postId", checkAccessToken, deletePost);

//? Post a new Comment
router.post("/add-comment", checkAccessToken, addComment);

//? Get All Comment
router.get("/all-comment/:postId", getAllComment);

module.exports = router;
