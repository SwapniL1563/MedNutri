import jwt from "jsonwebtoken";
import User from '../models/userModel.js'

export const authMiddleware = async(req,res,next) => {
    let token;

    // accept token from headers or query string
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    // get only the token - remove Bearer
       token = req.headers.authorization.split(" ")[1];
     } else if(req.query.token) {
       token = req.query.token;
     };

    try {
       // verify the token
       const decoded = jwt.verify(token,process.env.JWT_SECRET);
       req.user = await User.findById(decoded.id).select("-password" && "_id");
       next();
    } catch (error) {
       res.status(401).json({
        error: "Invalid token"
       })
    }
};