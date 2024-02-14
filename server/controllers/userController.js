const { UserModel } = require("../models/User.js");
const { PostModel } = require("../models/Post.js");
const { FollowerModel } = require("../models/Follower.js");
const { FollowingModel } = require("../models/Following.js");

//? Function Get User By Id
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const [user, postCount] = await Promise.all([
      UserModel.findById(userId),
      PostModel.countDocuments({ userId: userId }),
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = {
      name: user.name,
      email: user.email,
      postCount: postCount,
    };

    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//? Function Get Online Users
const getOnlineUsers = async (req, res) => {
  try {
    const onlineUsers = await UserModel.find({ status: "online" });

    const onlineUsersData = onlineUsers.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
    }));

    res.status(200).json(onlineUsersData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//? Function Following User
async function followUser(req, res) {
  const { userId } = req.params; //? Followed User
  const followingId = req.body.userId; //? Following User

  try {
    const isFollowing = await FollowerModel.exists({
      userId,
      followerId: followingId,
    });

    if (isFollowing) {
      return res.json({
        success: false,
        message: "Anda sudah mengikuti pengguna ini.",
      });
    } else {
      const follower = new FollowerModel({ userId, followerId: followingId });
      await follower.save();

      const following = new FollowingModel({
        userId: followingId,
        followingId: userId,
      });
      await following.save();

      res.json({ success: true, message: "Berhasil mengikuti pengguna." });
    }
  } catch (error) {
    console.error("Error following/unfollowing user:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengikuti/membatalkan follow pengguna.",
    });
  }
}

//? Function Check Is Following User
const checkFollow = async (req, res) => {
  const { userId } = req.params; //? Followed User
  const followingId = req.body.userId; //? Following User

  try {
    const isFollowing = await FollowerModel.exists({
      userId,
      followerId: followingId,
    });
    console.log(isFollowing);
    res.json({ isFollowing });
  } catch (error) {
    console.error("Error checking follow:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//? Function Count Follower -> Followed
const countFollower = async (req, res) => {
  const { userId } = req.params; //? Followed User

  try {
    const followerCount = await FollowerModel.countDocuments({ userId });

    res.json({ success: true, followerCount });
  } catch (error) {
    console.error("Error counting followers:", error);
    res
      .status(500)
      .json({ success: false, message: "Gagal menghitung jumlah follower." });
  }
};

module.exports = {
  getUserById,
  getOnlineUsers,
  followUser,
  checkFollow,
  countFollower,
};
