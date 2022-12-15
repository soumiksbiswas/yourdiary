var jwt = require("jsonwebtoken");
const JWT_SECRET = "ajbvahjajcbaahbcja";

const fetchuser = (req, res, next) => {
  // next will call the next function after the middleware where it is used
  // Get the user from the jwt token and add id to req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
  // it may happen that our token is not valid
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};

module.exports = fetchuser;