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

module.exports = {
  createAccessToken,
  createRefreshToken,
  createStatusToken,
};
