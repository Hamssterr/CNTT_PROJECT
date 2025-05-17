import jwt from "jsonwebtoken";

export const authenticateToken = (allowedRoles = []) => {
  return (req, res, next) => {
    const token =
      req.cookies?.jwt ||
      req.headers.authorization?.split(" ")[1] ||
      req.headers["x-access-token"];
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided, please log in" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res
            .status(403)
            .json({ message: "Token has expired, please log in again" });
        }
        return res.status(403).json({ message: "Invalid token" });
      }

      req.user = decoded; // { userId, role }
      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res
          .status(403)
          .json({ message: "Access denied: insufficient permissions" });
      }
      next();
    });
  };
};

export const logout = (req, res) => {
  console.log(`User ${req.user.userId} logged out`);
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
