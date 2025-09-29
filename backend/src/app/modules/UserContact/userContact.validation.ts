/* eslint-disable no-useless-escape */
import { z } from 'zod';

const addContactSchema = z.object({
  body: z.object({
    phoneNumber: z
      .string()
      .min(10, 'Phone number must be at least 10 digits')
      .regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number format'),
    alias: z
      .string()
      .min(1, 'Alias is required')
      .max(100, 'Alias cannot exceed 100 characters'),
    labels: z.array(z.string()).optional(),
    notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
  }),
});

const updateContactSchema = z.object({
  body: z.object({
    alias: z.string().min(1).max(100).optional(),
    labels: z.array(z.string()).optional(),
    notes: z.string().max(500).optional(),
  }),
});

const searchContactsSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    searchBy: z.enum(['alias', 'phone', 'both']).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const UserContactValidation = {
  addContactSchema,
  updateContactSchema,
  searchContactsSchema,
};