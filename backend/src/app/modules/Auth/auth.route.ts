import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post(
  '/register',
  validateRequest(AuthValidation.registerSchema),
  AuthControllers.register
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginSchema),
  AuthControllers.loginUser
);

router.post(
  '/change-password',
  auth(),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword
);

export const AuthRoutes = router;