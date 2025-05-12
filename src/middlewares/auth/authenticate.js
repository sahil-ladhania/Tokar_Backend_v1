import jwt from 'jsonwebtoken';
import { sendError } from '../../utils/sendError.js';

const secret = process.env.JWT_SECRET;

export const authenticate = (req , res , next) => {
    try {
        const token = req.cookies.jwt;
        if(!token){
            return sendError(res , 401 , "Token Not Found !!!");
        };

        jwt.verify(token , secret , (error, decodedJWT) => {
            if(error){
                return sendError(res , 403 , "Invalid or Expired Token !!!");
            }
            req.user = decodedJWT;
            next();
        });
    }
    catch (error) {
        return sendError(res , 403 , "Invalid or Expired Token !!!");
    }
}