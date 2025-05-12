import { Router } from 'express'
import { changePasswordController, forgotPasswordController, loginController, logoutController, resetPasswordController, signupController } from './auth.controller.js'
import { validateRequest } from '../../middlewares/validation/validateRequest.js';
import { changePasswordSchema, forgotPasswordSchema, loginSchema, signupSchema } from './auth.data-validator.js';

const router = Router();

router.post('/signup', validateRequest(signupSchema) , signupController);
router.post('/login', validateRequest(loginSchema) ,  loginController);
router.post('/forgot-password', validateRequest(forgotPasswordSchema) ,  forgotPasswordController);
router.post('/reset-password', resetPasswordController);
router.patch('/change-password', validateRequest(changePasswordSchema) ,  changePasswordController);
router.post('/logout', logoutController);

export default router