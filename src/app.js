import express from 'express';
import authRouter from './modules/auth/auth.routes.js';
import { errorHandler } from './middlewares/error/errorHandler.js';

const app = express();
const port = process.env.PORT || 3000;

// Global Middlewares
app.use(express.json());

// Route Handlers
app.use('/api/auth' , authRouter);


// Global Error Handler
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Tokar listening on port ${port}`)
})
