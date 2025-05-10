import jwt from 'jsonwebtoken'

export const verifyFinance = (req, res, next) => {
    const token = req.cookies.jwt;

    if(!token){
        return res.status(401).json({message: "No token provided, please log in"})
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
            if(err){
                if(err.name === "TokenExpiredError"){
                    return res.status(401).json({message: "Token has expired, please log in again"})
                }
                return res.status(401).json({message: "Invalid token"});
            }

            const role = data.role;

            if (role !== "finance") {
              return res
                .status(401)
                .json({
                  message:
                    "This token has no access rights, you are not a Fianance",
                });
            } else {
              req.user = data;
              next();
            }
        })
    } catch (error) {
        console.error("Error in getDataStudent:", error.message);
        res.status(500).json({
          success: false,
          message: "Internal Server Error",
        });
    }
}