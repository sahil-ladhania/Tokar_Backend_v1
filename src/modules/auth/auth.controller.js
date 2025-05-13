import { sendError } from "../../utils/sendError.js";
import { sendSuccess } from "../../utils/sendSuccess.js";
import { comparingPassword, generatePasswordResetToken, hashingPassword, sendPasswordResetEmail } from "./auth.helper.js";
import { ifUserExist, ifUserValid } from "./auth.ownership-validator.js";
import { changePasswordService, forgotPasswordService, loginService, resetPasswordService, signupService } from "./auth.service.js";

export const signupController = async(req , res , next) => {
    try {
        const {firstName , lastName , email , phone , password} = req.body;

        const userExist = await ifUserExist(email);
        if(userExist){
            return sendError(res , 400 , "User Already Exist !!!");
        }

        const hashedPassword = await hashingPassword(password);

        const user = await signupService({firstName , lastName , email , phone , password:hashedPassword});
        if(!user){
            return sendError(res , 500 , "Error Signing Up !!!");
        }

        return sendSuccess(res , 201 , { user });
    } 
    catch (error) {
        next(error);
    }
}

export const loginController = async(req , res , next) => {
    try {
        const {email , password} = req.body;

        const userExist = await ifUserExist(email);
        if(!userExist){
            return sendError(res , 404 , "User Doesnt Exist , Please Sign Up First !!!");
        }

        const passwordMatch = await comparingPassword({password , hashedPassword : userExist.password});
        if(!passwordMatch){
            return sendError(res , 401 , "Invalid Credentials !!!");
        }

        const {user , jwt} = await loginService({email , password});

        res.cookie("jwt" , jwt , {
            maxAge : 3600000, 
            httpOnly : true , 
            path: '/', 
            sameSite : 'Lax' , 
            secure : false
        });

        const { password: hashP, ...safeUser } = user;

        return sendSuccess(res , 200 , {user: safeUser});
    } 
    catch (error) {
        next(error);
    }
}

export const changePasswordController = async(req , res , next) => {
    try {
        const {currentPassword , newPassword , confirmPassword} = req.body;
        const {email} = req.user;

        const userExist = await ifUserExist(email);
        if(!userExist){
            return sendError(res , 400 , "User Doesnt Exist !!!");
        }

        const passwordMatch = await comparingPassword({password:currentPassword , hashedPassword : userExist.password});
        if(!passwordMatch){
            return sendError(res , 401 , "Invalid Credentials !!!");
        }

        const hashedPassword = await hashingPassword(newPassword);

        const updatedCredentials = await changePasswordService({email , password : hashedPassword});
        if(!updatedCredentials){
            return sendError(res , 500 , "Error Updating Credentials !!!");
        }

        return sendSuccess(res , 200 , { message: "Password Updated Successfully !!!" });
    }
    catch (error) {
        next(error);
    }
}

export const forgotPasswordController = async(req , res , next) => {
    try {
        const {email} = req.body;
        
        const userExist = await ifUserExist(email);
        if(!userExist){
            return sendError(res , 400 , "User Doesnt Exist !!!");
        }

        const {resetToken , expiresIn} = generatePasswordResetToken();

        const updatedPasswordData = await forgotPasswordService({email , resetToken , expiresIn});

        const resetLink = `http://localhost:3000/api/auth/reset-password?token=${resetToken}`;
        
        const emailInfo = await sendPasswordResetEmail({
            to: email,
            subject: 'Reset Your Password',
            html: `
              <h2>Password Reset</h2>
              <p>Click below to reset your password:</p>
              <a href="${resetLink}">${resetLink}</a>
            `
        });

        return sendSuccess(res , 200 , { message: "Reset Link Sent to your Email !!!" })

    } 
    catch (error) {
        next(error);
    }
}

export const resetPasswordController = async(req , res , next) => {
    try {
        const {newPassword , confirmPassword} = req.body;
        const {resetToken} = req.query;

        const userValid = await ifUserValid(resetToken);
        if(!userValid){
            return sendError(res , 400 , "User Isnt Valid !!!");
        }

        const hashedPassword = await hashingPassword(newPassword);

        const updatedCredentials = await resetPasswordService({email : userValid.email , password : hashedPassword});
        if(!updatedCredentials){
            return sendError(res , 500 , "Error Updating Credentials !!!");
        }
        
        return sendSuccess(res , 200 , { message: "Password Reset Successfully !!!" });
    } 
    catch (error) {
        next(error);
    }
}

export const logoutController = async(req , res , next) => {
    try {
        res.clearCookie("jwt" , {
            path: "/",                
            httpOnly: false,          
            sameSite: "None",         
            secure: false,   
        });

        return sendSuccess(res , 200 , {message : "Logged Out Successfully !!!"});
    } 
    catch (error) {
        next(error);
    }
}