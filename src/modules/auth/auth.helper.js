import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

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

export const generatePasswordResetToken = () => {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresIn = new Date(Date.now() + 15 * 60  * 1000);
    return {resetToken , expiresIn};
}

export const sendPasswordResetEmail = async({ to, subject, html }) => {
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const info = await transport.sendMail({
        from: '"YourApp" <noreply@yourapp.com>',
        to,
        subject,
        html
    });
    
    return info;
};