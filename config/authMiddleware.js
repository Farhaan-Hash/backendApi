import jwt from "jsonwebtoken";
const verifyToken = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const user = jwt.verify(token, process.env.JWT_KEY);
      req.body.user = user;
      next();
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
  if (!token) {
    res.status(401).json({msg: "Not Authorized"});
  }
};

export default verifyToken;
