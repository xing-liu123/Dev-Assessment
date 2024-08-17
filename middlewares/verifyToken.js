import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "thisisthekey";

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token is provided." });
  }

  // Assume client uses Bearer + <token>
  try {
    const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Failed to authenticate token." });
  }
}

export { verifyToken, SECRET_KEY };
