const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "you must be logged in 000" });
  }
  jwt.verify(authorization, "shhhhh", (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "you must be logged in" });
    }
    const { username } = payload;
    User.findOne({ username }).then((userdata) => {
      req.user = userdata;
      next();
    });
  });
};
