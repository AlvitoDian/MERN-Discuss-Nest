const mongoose = require("mongoose");
const { UserModel } = require("../models/User.js");

const Schema = mongoose.Schema;

//? Schema Factory
const postSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "Users" },
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  date: { type: Date, default: Date.now },
});

//? Model Factory

const PostModel = mongoose.model("Posts", postSchema);

//? Export Factory
module.exports = {
  PostModel,
};
