const { body, validationResult } = require("express-validator");
const { PostModel } = require("../models/Post.js");
const slugify = require("slugify");

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

module.exports = {
  getAllPost,
  addPost,
  getPostBySlug,
};
