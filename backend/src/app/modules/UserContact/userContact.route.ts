import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserContactControllers } from './userContact.controller';
import { UserContactValidation } from './userContact.validation';

const router = Router();

// Add new contact
router.post(
  '/',
  auth(),
  validateRequest(UserContactValidation.addContactSchema),
  UserContactControllers.addContact
);

// Get all my contacts with optional search/filter
router.get(
  '/',
  auth(),
  validateRequest(UserContactValidation.searchContactsSchema),
  UserContactControllers.getMyContacts
);

// Search contacts
router.get(
  '/search',
  auth(),
  validateRequest(UserContactValidation.searchContactsSchema),
  UserContactControllers.searchContacts
);

// Update my contact (alias, labels, notes)
router.patch(
  '/:id',
  auth(),
  validateRequest(UserContactValidation.updateContactSchema),
  UserContactControllers.updateMyContact
);

// Delete my contact
router.delete('/:id', auth(), UserContactControllers.deleteMyContact);

export const UserContactRoutes = router;