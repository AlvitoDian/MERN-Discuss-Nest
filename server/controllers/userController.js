const { UserModel } = require("../models/User.js");
const { PostModel } = require("../models/Post.js");
const { FollowerModel } = require("../models/Follower.js");
const { FollowingModel } = require("../models/Following.js");
const {
  createAccessToken,
  createRefreshToken,
  createStatusToken,
} = require("../utils/tokenGenerator");
const fs = require("fs");

//? Function Get User By Id
const getUserBySlug = async (req, res) => {
  try {
    const userSlug = req.params.slug;

    const user = await UserModel.findOne({ slug: userSlug });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const postCount = await PostModel.countDocuments({ userId: user._id });

    const userData = {
      name: user.name,
      email: user.email,
      postCount: postCount,
      profileImage: user.profileImage,
    };

    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//? Function Update User By Id
const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, email } = req.body;
  console.log(req.file, name, email);

  try {
    const existingUser = await UserModel.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const oldProfileImage = existingUser.profileImage;

    existingUser.name = name || existingUser.name;
    existingUser.email = email || existingUser.email;

    if (req.file) {
      if (oldProfileImage) {
        const oldImagePath = `public/images/${oldProfileImage}`;

        fs.unlinkSync(oldImagePath);
      }
      existingUser.profileImage = req.file.filename;
    }

    const updatedUser = await existingUser.save();

    const updatedAccessToken = createAccessToken(updatedUser);
    const updatedRefreshToken = createRefreshToken(updatedUser);
    const updatedStatusToken = createStatusToken(updatedUser);

    res.cookie("accessToken", updatedAccessToken, {
      maxAge: 1 * 60 * 1000,
    });
    res.cookie("refreshToken", updatedRefreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.cookie("statusToken", updatedStatusToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
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
      slug: user.slug,
      profileImage: user.profileImage,
    }));

    res.status(200).json(onlineUsersData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//? Function Following User
async function followUser(req, res) {
  const { userSlug } = req.params; //? Followed User
  const followingId = req.body.userId; //? Following User

  //? Find userId by params Slug
  const userId = await UserModel.findOne({ slug: userSlug });

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
  const { userSlug } = req.params; //? Followed User
  const followingId = req.body.userId; //? Following User

  //? Find userId by params Slug
  const userId = await UserModel.findOne({ slug: userSlug });

  try {
    const isFollowing = await FollowerModel.exists({
      userId,
      followerId: followingId,
    });

    res.json({ isFollowing });
  } catch (error) {
    console.error("Error checking follow:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//? Function Count Follower -> Followed
const countFollower = async (req, res) => {
  const { userSlug } = req.params; //? Followed User

  //? Find userId by params Slug
  const userId = await UserModel.findOne({ slug: userSlug });
  try {
    const followerCount = await FollowerModel.countDocuments({
      userId,
    });

    res.json({ success: true, followerCount });
  } catch (error) {
    console.error("Error counting followers:", error);
    res
      .status(500)
      .json({ success: false, message: "Gagal menghitung jumlah follower." });
  }
};

module.exports = {
  getUserBySlug,
  getOnlineUsers,
  followUser,
  checkFollow,
  countFollower,
  updateUser,
};
