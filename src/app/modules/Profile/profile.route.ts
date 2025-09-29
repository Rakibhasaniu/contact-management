import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProfileControllers } from './profile.controller';
import { ProfileValidation } from './profile.validation';

const router = Router();

router.get('/me', auth(), ProfileControllers.getMyProfile);

router.patch(
  '/me',
  auth(),
  validateRequest(ProfileValidation.updateProfileSchema),
  ProfileControllers.updateMyProfile
);

export const ProfileRoutes = router;