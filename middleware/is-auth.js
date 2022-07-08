const jwt = require("jsonwebtoken");
const { throwError } = require("../utils/error");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    throwError("Not authenticated.", 401);
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    // verify and decode token
    decodedToken = jwt.verify(token, "supersecret");
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    throwError("Not authenticated. 2", 401);
  }
  // hook this information to our request object
  req.user = {
    name: decodedToken.name,
    _id: decodedToken.userId,
  };
  next();
};
