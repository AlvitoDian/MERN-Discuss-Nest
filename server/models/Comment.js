const mongoose = require("mongoose");
const { UserModel } = require("../models/User.js");
const { PostModel } = require("../models/Post.js");

const Schema = mongoose.Schema;

//? Schema Factory
const commentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "Users" },
  postId: { type: Schema.Types.ObjectId, ref: "Posts" },
  /* slug: {
    type: String,
    required: true,
  }, */
  content: {
    type: String,
    required: true,
  },
  date: { type: Date, default: Date.now },
});

//? Model Factory

const CommentModel = mongoose.model("Comments", commentSchema);

//? Export Factory
module.exports = {
  CommentModel,
};
