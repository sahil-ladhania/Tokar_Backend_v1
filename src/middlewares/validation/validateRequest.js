
export const validateRequest = (schema) => {
    return (req, res , next) => {
        const { success, error, data } = schema.safeParse({
            params: req.params,
            query:  req.query,
            body:   req.body,
          });

          if (!success) {
            const { fieldErrors } = error.flatten();
            return res
              .status(400)
              .send({ 
                    success: false, 
                    errors: fieldErrors 
                });
          }
      
          req.body = data.body;
          Object.assign(req.params, data.params);
          Object.assign(req.query,  data.query);
      
          next();
    }
}