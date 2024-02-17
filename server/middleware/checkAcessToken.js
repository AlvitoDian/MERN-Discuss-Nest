require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const axios = require("axios");

const checkAccessToken = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  /*   console.log("Access Token : ", accessToken); */

  const refreshToken = req.cookies.refreshToken;
  /*   console.log("Refresh Token : ", refreshToken); */

  if (!refreshToken) {
    return res.status(401).send({ auth: false, message: "No Auth" });
  }

  if (!accessToken) {
    console.log("Access Token not found");
    if (renewAccessTokenFunction(req, res)) {
      next();
    }
  } else {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ valid: false, message: "No access token found" });
      } else {
        req._id = decoded._id;
        req.name = decoded.name;
        req.slug = decoded.slug;
        req.email = decoded.email;
        next();
      }
    });
  }
};

/* const renewAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  console.log("Refresh Token :", refreshToken);

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

      console.log(
        "New Access Token set in the cookie via FUNCTION:",
        accessToken
      );
    } catch (err) {
      console.error("Error renewing access token:", err);
      return res.json({ valid: false, message: "Invalid Token" });
    }
  }
}; */

/* const renewAccessToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  console.log("Refresh Token 2 :", refreshToken);

  if (!refreshToken) {
    console.log("error2");
    return;
  } else {
    try {
      const decoded = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
      const accessToken = jwt.sign(
        { _id: decoded._id, name: decoded.name },
        process.env.ACCESS_TOKEN,
        { expiresIn: "1m" }
      );
      res.cookie("accessToken", accessToken, { maxAge: 60000 });

      console.log(
        "New Access Token set in the cookie via FUNCTION:",
        accessToken
      );

      next();

      // If you want to pass the new access token to the next middleware, uncomment the following line
      // req.cookies.accessToken = accessToken;
    } catch (err) {
      console.error("Error renewing access token:", err);
      return res.json({ valid: false, message: "Invalid Token" });
    }
  }
}; */

const renewAccessTokenFunction = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  /*  console.log("Refresh Token 2:", refreshToken); */

  if (refreshToken) {
    try {
      const decoded = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
      const accessToken = jwt.sign(
        {
          _id: decoded._id,
          name: decoded.name,
          slug: decoded.slug,
          email: decoded.email,
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: "1m" }
      );

      res.cookie("accessToken", accessToken, { maxAge: 60000 });
      /*   console.log(
        "New Access Token set in the cookie via FUNCTION:",
        accessToken
      ); */
    } catch (err) {
      console.error("Error renewing access token:", err);
      return res.json({ valid: false, message: "Invalid Token" });
    }
  }
};

const renewAccessToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  /*   console.log("Refresh Token 2:", refreshToken); */

  if (refreshToken) {
    try {
      const decoded = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
      const accessToken = jwt.sign(
        {
          _id: decoded._id,
          name: decoded.name,
          slug: decoded.slug,
          email: decoded.email,
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: "1m" }
      );

      res.cookie("accessToken", accessToken, { maxAge: 60000 });
      /*    console.log(
        "New Access Token set in the cookie via FUNCTION:",
        accessToken
      ); */
    } catch (err) {
      console.error("Error renewing access token:", err);
      return res.json({ valid: false, message: "Invalid Token" });
    }
  }

  next();
};

/* module.exports = checkAccessToken; */
module.exports = { checkAccessToken, renewAccessToken };
