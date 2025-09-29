import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(50, 'Password must not exceed 50 characters'),
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(50, 'First name too long'),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(50, 'Last name too long'),
    otherEmails: z.array(z.string().email()).optional(),
    contacts: z
      .array(
        z.object({
          phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
          alias: z.string().min(1, 'Alias is required'),
        })
      )
      .optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});