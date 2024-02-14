const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const followerSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

const FollowerModel = mongoose.model("Follower", followerSchema);

module.exports = {
  FollowerModel,
};
