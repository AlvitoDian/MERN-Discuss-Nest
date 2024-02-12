const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

const requireAuth = async (req, res, next) => {
  //? Verify Auth USER
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Auth token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    req.user = await UserModel.findOne({ _id }).select("_id");
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Req is not authorized" });
  }
};

module.exports = requireAuth;
