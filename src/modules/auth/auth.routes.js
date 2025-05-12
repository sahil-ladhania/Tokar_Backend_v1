import { Router } from 'express'
import { changePasswordController, forgotPasswordController, getProfileController, loginController, logoutController, resetPasswordController, signupController } from './auth.controller.js'

const router = Router()

router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/logout', logoutController);
router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password', resetPasswordController);
router.patch('/change-password', changePasswordController);
router.get('/profile', getProfileController);

export default router