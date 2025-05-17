import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  const token =
    req.cookies?.jwt ||
    req.headers.authorization?.split(" ")[1] ||
    req.headers["x-access-token"];

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided, please log in as ADMIN" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res
            .status(401)
            .json({ message: "Token has expired, please log in again" });
        }
        return res.status(401).json({ message: "Invalid token" });
      }

      const role = data.role;

      if (role !== "admin" && role !== "finance") {
        return res.status(401).json({
          message: "This token has no access rights, you are not a Admin",
        });
      } else {
        req.user = data;
        next();
      }
    });
  } catch (error) {
    console.error("Error in getDataStudent:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
