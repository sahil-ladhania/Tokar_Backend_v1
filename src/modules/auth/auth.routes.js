import { Router } from 'express'
import { changePasswordController, forgotPasswordController, loginController, logoutController, resetPasswordController, signupController } from './auth.controller.js'
import { validateRequest } from '../../middlewares/validation/validateRequest.js';
import { changePasswordSchema, forgotPasswordSchema, loginSchema, resetPasswordSchema, signupSchema } from './auth.data-validator.js';
import { authenticate } from '../../middlewares/auth/authenticate.js';

const router = Router();

router.post('/signup', validateRequest(signupSchema) , signupController);
router.post('/login', validateRequest(loginSchema) ,  loginController);
router.put('/change-password', authenticate , validateRequest(changePasswordSchema) ,  changePasswordController);
router.post('/forgot-password', authenticate , validateRequest(forgotPasswordSchema) ,  forgotPasswordController);
router.post('/reset-password' , validateRequest(resetPasswordSchema) , resetPasswordController);
router.post('/logout', authenticate , logoutController);

export default router