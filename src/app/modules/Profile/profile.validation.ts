import { z } from 'zod';

const createProfileValidationSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: 'User ID is required',
    }),
    firstName: z.string({
      required_error: 'First name is required',
    }),
    lastName: z.string({
      required_error: 'Last name is required',
    }),
    otherEmails: z.array(z.string().email()).optional(),
    initialContacts: z.array(z.object({
      phoneNumber: z.string({
        required_error: 'Phone number is required',
      }),
      alias: z.string({
        required_error: 'Alias is required',
      }),
    })).optional(),
  }),
});

const updateProfileValidationSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    otherEmails: z.array(z.string().email()).optional(),
  }),
});

export const ProfileValidation = {
  createProfileValidationSchema,
  updateProfileValidationSchema,
};