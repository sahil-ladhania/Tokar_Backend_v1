import prisma from "../../db/DB.js";
import { generateJWT } from "./auth.helper.js";

export const signupService = async({firstName , lastName , email , phone , password}) => {
    try {
        const user = await prisma.user.create({
            data : {
                firstName : firstName,
                lastName : lastName,
                email : email,
                phone : phone,
                password : password,
            }
        });
        return user;
    } 
    catch (error) {
        throw new Error("Error Signing Up !!!" , error.message);
    }
}

export const loginService = async({email , password}) => {
    try {
        const user = await prisma.user.findUnique({
            where : {
                email : email
            }
        });

        const JWT = await generateJWT(user.userId , user.firstName , user.email);

        const User = {
            user : user,
            jwt : JWT
        };

        return User;
    } 
    catch (error) {
        throw new Error("Error Logging In !!!" , error.message);
    }
}

export const changePasswordService = async({email , password}) => {
    try {
        const updatedCredentials = await prisma.user.update({
            where : {
                email : email
            },
            data : {
                password : password
            }
        })
        return updatedCredentials;
    } 
    catch (error) {
        throw new Error("Message..." , error);
    }
}

export const forgotPasswordService = async() => {
    try {
        
    } 
    catch (error) {
        throw new Error("Message..." , error);
    }
}

export const resetPasswordService = async() => {
    try {
        
    } 
    catch (error) {
        throw new Error("Message..." , error);
    }
}

export const logoutService = async() => {
    try {
        
    } 
    catch (error) {
        throw new Error("Message..." , error);
    }
}