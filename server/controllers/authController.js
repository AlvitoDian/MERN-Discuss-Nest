require("dotenv").config();
const { access } = require("fs");
const { UserModel } = require("../models/User.js");
const jwt = require("jsonwebtoken");
const {
  createAccessToken,
  createRefreshToken,
  createStatusToken,
} = require("../utils/tokenGenerator");
const slugify = require("slugify");

//? Login Method
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.login(email, password);

    //? Set Online Status
    await UserModel.findByIdAndUpdate(user._id, { status: "online" });

    //? Create Token
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    const statusToken = createStatusToken(user);

    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 1 * 60 * 1000,
    });

    res.cookie("statusToken", statusToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const name = user.name;
    const _id = user._id;
    res.status(200).json({ _id, name });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//? Signup Method
const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await UserModel.signup(name, email, password);

    await UserModel.findByIdAndUpdate(user._id, { status: "online" });

    //? Create Token
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    const statusToken = createStatusToken(user);

    /* res.status(200).json({ email, token }); */
    res.cookie("accessToken", accessToken, {
      maxAge: 1 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.cookie("statusToken", statusToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ name });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//? Logout Method
const logoutUser = async (req, res) => {
  const { userId } = req.body;

  try {
    await UserModel.findByIdAndUpdate(userId, { status: "offline" });

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.clearCookie("statusToken");

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signupUser, loginUser, logoutUser };
