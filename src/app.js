import express from 'express';
import authRouter from './modules/auth/auth.routes.js';
import { errorHandler } from './middlewares/error/errorHandler.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

// Global Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,               
}))

// Route Handlers
app.use('/api/auth' , authRouter);

// Global Error Handler
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Tokar listening on port ${port}`)
})
