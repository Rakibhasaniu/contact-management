import { z } from 'zod';

const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    otherEmails: z.array(z.string().email()).optional(),
  }),
});

export const ProfileValidation = {
  updateProfileSchema,
};