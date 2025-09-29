import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ProfileValidation } from './profile.validation';
import { ProfileControllers } from './profile.controller';
import auth from '../../middlewares/auth';


const router = express.Router();

router.post(
  '/',
  validateRequest(ProfileValidation.createProfileValidationSchema),
  ProfileControllers.createProfile
);

router.get(
  '/me',
  auth('superAdmin', 'admin', 'employee'),
  ProfileControllers.getProfile
);

router.put(
  '/me',
  auth('superAdmin', 'admin', 'employee'),
  validateRequest(ProfileValidation.updateProfileValidationSchema),
  ProfileControllers.updateProfile
);

export const ProfileRoutes = router;