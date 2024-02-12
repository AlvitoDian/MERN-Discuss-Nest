const { UserModel } = require("../models/User.js");
const { PostModel } = require("../models/Post.js");

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

module.exports = {
  getUserById,
};
