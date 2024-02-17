const { body, validationResult } = require("express-validator");
const { UserModel } = require("../models/User.js");
const { PostModel } = require("../models/Post.js");
const { CommentModel } = require("../models/Comment.js");

//? Function Get All Comment
const getAllComment = async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await CommentModel.find({ postId }).populate(
      "userId",
      "name profileImage"
    );

    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//? Function Add Comment
const addCommentValidationRules = [
  body("userId").notEmpty(),
  body("postId").notEmpty(),
  body("content")
    .notEmpty()
    .withMessage("Content cannot be empty")
    .isString()
    .withMessage("Content must be a string"),
];

const addComment = async (req, res) => {
  // Apply validation rules
  await Promise.all(
    addCommentValidationRules.map((validationRule) => validationRule.run(req))
  );

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // If validation passes, proceed with creating the post
  const { userId, postId, content, date } = req.body;

  const comment = new CommentModel({
    userId: userId,
    postId: postId,
    content: content,
    date: date,
  });

  try {
    const addComment = await comment.save();
    res.status(201).json(addComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllComment,
  addComment,
};
