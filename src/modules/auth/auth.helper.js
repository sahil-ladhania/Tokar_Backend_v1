import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const hashingPassword = async(password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password , saltRounds);
    return hashedPassword;        
}

export const comparingPassword = async({password , hashedPassword}) => {
    const ifPasswordMatch = await bcrypt.compare(password , hashedPassword);
    return ifPasswordMatch;
}

export const generateJWT = async(userId , firstName , email) => {
    const payload = {
        userId : userId,
        firstName : firstName,
        email : email
    };

    const secret = process.env.JWT_SECRET;

    const options = {
        expiresIn : "1h"
    }

    const JWT = jwt.sign(payload , secret , options);

    return JWT;
}