require("dotenv").config();
const jwt = require("jsonwebtoken");

const renewAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  console.log("Refresh Token Link :", refreshToken);

  if (!refreshToken) {
    console.log("error2");
    return res.status(401);
  } else {
    try {
      const decoded = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
      const accessToken = jwt.sign(
        { _id: decoded._id, name: decoded.name },
        process.env.ACCESS_TOKEN,
        { expiresIn: "1m" }
      );
      res.cookie("accessToken", accessToken, { maxAge: 60000 });

      console.log("New Access Token set in the cookie via ROUTE:", accessToken);
      return res
        .status(200)
        .json({ valid: true, message: "Access token renewed successfully" });
    } catch (err) {
      console.error("Error renewing access token:", err);
      return res.status(401).json({ valid: false, message: "Invalid Token" });
    }
  }
};

module.exports = renewAccessToken;
