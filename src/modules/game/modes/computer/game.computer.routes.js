import { Router } from 'express'
import { createGameSessionController } from '../computer/game.computer.controller.js';
import { playWithComputerSchema } from '../computer/game.computer.data-validator.js';
import { authenticate } from '../../../../middlewares/auth/authenticate.js';
import { validateRequest } from '../../../../middlewares/validation/validateRequest.js';

const router = Router();

router.post('/mode/computer', authenticate , validateRequest(playWithComputerSchema) , createGameSessionController);

export default router;