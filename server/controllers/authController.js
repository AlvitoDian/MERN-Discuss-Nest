require("dotenv").config();
const { access } = require("fs");
const { UserModel } = require("../models/User.js");
const jwt = require("jsonwebtoken");

//? Create Access Token
const createAccessToken = (user) => {
  return jwt.sign(
    { _id: user._id, name: user.name },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: "1m",
    }
  );
};

//? Create Refresh Token
const createRefreshToken = (user) => {
  return jwt.sign(
    { _id: user._id, name: user.name },
    process.env.REFRESH_TOKEN,
    { expiresIn: "7d" }
  );
};

//? Create User Status Token
const createStatusToken = (user) => {
  return jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN, {
    expiresIn: "7d",
  });
};
/* const createToken = (user) => {
  const { _id, email } = user;
  return jwt.sign({ _id, email }, process.env.SECRET, { expiresIn: "2d" });
}; */

//? Login Method
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.login(email, password);

    //? Create Token
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    const statusToken = createStatusToken(user);
    /* const refreshToken = createRefreshToken(user._id); */
    // const token = createToken(user);

    /* res.status(200).json({ email, token }); */
    //? Set HTTP-only cookie with the token
    /* res.cookie("authToken", token, { httpOnly: true }); */
    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 1 * 60 * 1000,
      /* httpOnly: true, */
    });

    res.cookie("statusToken", statusToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const name = user.name;
    res.status(200).json({ name });

    /* res.json({ accessToken }); */
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//? Signup Method
const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await UserModel.signup(name, email, password);

    //? Create Token
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    /* res.status(200).json({ email, token }); */
    res.cookie("accessToken", accessToken, {
      maxAge: 1 * 60 * 1000,
      /* httpOnly: true, */
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.status(200).json({ name });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//? Logout Method
const logoutUser = async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.clearCookie("statusToken");

  // Send a response indicating successful logout
  res.status(200).json({ success: true, message: "Logout successful" });
};

module.exports = { signupUser, loginUser, logoutUser };
