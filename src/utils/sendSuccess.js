
export const sendSuccess = (res , statusCode , data) => {
    res.status(statusCode).send({ 
        success: true, 
        ...data
    });
};