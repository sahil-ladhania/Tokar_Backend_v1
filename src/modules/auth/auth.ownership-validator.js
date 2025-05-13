import prisma from "../../db/DB.js";

export const ifUserExist = async(email) => {
    try {
        const user = await prisma.user.findUnique({
            where : {
                email : email
            }
        })
        return user;
    }
    catch (error) {
        throw new Error("Error Checking User Existance !!!" , error);
    }
}

export const ifUserValid = async(resetToken) => {
    try {
        const user = await prisma.user.findFirst({
            where : {
                passwordResetToken : resetToken,
                passwordResetExpires : {
                    gt : new Date()
                }
            }
        })

        return user;
    }
    catch (error) {
        throw new Error("Error Checking User Validity !!!" , error);
    }
}