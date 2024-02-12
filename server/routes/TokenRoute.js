const express = require("express");

const { renewAccessToken } = require("../middleware/checkAcessToken");

const router = express.Router();

//? get Renew Token
router.post("/renew-token", renewAccessToken);

module.exports = router;
