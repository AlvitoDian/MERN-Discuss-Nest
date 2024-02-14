const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const followingSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  followingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

const FollowingModel = mongoose.model("Following", followingSchema);

module.exports = {
  FollowingModel,
};
