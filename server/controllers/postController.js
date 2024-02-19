const { body, validationResult } = require("express-validator");
const { PostModel } = require("../models/Post.js");
const { UserModel } = require("../models/User.js");
const slugify = require("slugify");
const fs = require("fs");

//? Function Show All Data Post
const getAllPost = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ date: -1 })
      .populate("userId", "name slug");

    res.json(posts);
  } catch (error) {
    /* res.json({ message: error.message }); */
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//? Function Show All Data Post By User
const getAllPostByUser = async (req, res) => {
  const { userSlug } = req.params;

  try {
    const user = await UserModel.findOne({ slug: userSlug });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await PostModel.find({ userId: user._id })
      .sort({ date: -1 })
      .populate("userId", "name slug");
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//? Function Add Post
const addPostValidationRules = [
  body("userId").notEmpty(),

  body("title")
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isString()
    .withMessage("Title must be a string"),
  ,
  body("category")
    .notEmpty()
    .withMessage("Category cannot be empty")
    .isString()
    .withMessage("Category must be a string"),
  ,
  body("body")
    .notEmpty()
    .withMessage("Content cannot be empty")
    .isString()
    .withMessage("Content must be a string"),
];

const addPost = async (req, res) => {
  // Apply validation rules
  await Promise.all(
    addPostValidationRules.map((validationRule) => validationRule.run(req))
  );

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // If validation passes, proceed with creating the post
  const { title, category, body } = req.body;

  // Generate slug from title
  let slug = slugify(title, {
    lower: true,
    remove: /[*+~.()'"?!:@]/g,
  });

  // Check for existing posts with the same slug
  const existingPost = await PostModel.findOne({ slug });

  // If there's an existing post with the same slug, make the slug unique
  if (existingPost) {
    let counter = 1;
    let newSlug = slug;

    // Keep appending a counter until a unique slug is found
    while (await PostModel.findOne({ slug: newSlug })) {
      newSlug = `${slug}-${counter}`;
      counter++;
    }

    slug = newSlug;
  }

  const post = new PostModel({
    userId: req.body.userId,
    title,
    slug,
    category,
    body,
  });

  if (req.file) {
    post.postImage = req.file.filename;
  }

  try {
    const addedPost = await post.save();
    res.status(201).json(addedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//? Function Get Post By Slug
const getPostBySlug = async (req, res) => {
  try {
    const post = await PostModel.findOne({ slug: req.params.slug }).populate(
      "userId",
      "name slug"
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//? Function Update Post
const updatePost = async (req, res) => {
  const { userId } = req.params;
  const { title, category, body } = req.body;
  console.log(req.file, title, category, body, userId);

  try {
    const existingUser = await UserModel.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingPost = await PostModel.findOne({
      userId: existingUser._id,
    });

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const oldPostImage = existingPost.postImage;

    existingPost.title = title || existingPost.title;
    existingPost.category = category || existingPost.category;
    existingPost.body = body || existingPost.body;

    if (req.file) {
      if (oldPostImage) {
        const oldImagePath = `public/images/${oldPostImage}`;

        fs.unlinkSync(oldImagePath);
      }
      existingPost.postImage = req.file.filename;
    }

    const updatedPost = await existingPost.save();
    console.log(updatedPost);

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//? Function Delete Post
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const existingPost = await PostModel.findById(postId);

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    const deletedPost = await PostModel.findByIdAndDelete(existingPost._id);

    if (!deletedPost) {
      return res.status(404).json({ error: "Error deleting Post" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllPost,
  getAllPostByUser,
  addPost,
  getPostBySlug,
  updatePost,
  deletePost,
};
