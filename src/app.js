import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRouter from './modules/auth/auth.routes.js';
import gameComputerRouter from './modules/game/modes/computer/game.computer.routes.js';
import { errorHandler } from './middlewares/error/errorHandler.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors";
import { initSockets } from './modules/game/socket/socket.js';

dotenv.config();
const app = express();

// Global Middlewares
app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,               
}))

// Creating Socket Server
const server = createServer(app);
const io = new Server(server , {
  cors : {
    origin: 'http://localhost:5173', 
    credentials: true,               
  }
});

initSockets(io);

// Route Handlers
app.use('/api/auth' , authRouter);
app.use('/api/game' , gameComputerRouter);

// Global Error Handler
app.use(errorHandler)

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Tokar listening on port ${port}`)
})