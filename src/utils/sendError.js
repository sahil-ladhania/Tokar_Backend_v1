
export const sendError = (res , statusCode , message) => {
    res.status(statusCode).send({ 
        success: false, 
        error: message 
    });
};