/**
 * Go Bagage — Schémas de validation Zod
 * Alignés sur les règles du CDC et du contrat OpenAPI backend.
 */

import { z } from 'zod';

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address')
  .max(255, 'Email too long');

export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(
    /^\+[1-9]\d{7,14}$/,
    'Phone must be in international format (e.g. +237650255873)',
  );

export const passwordSchema = z
  .string()
  .min(8, 'Minimum 8 characters')
  .max(128, 'Maximum 128 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character (!@#$%...)');

export const firstNameSchema = z
  .string()
  .min(2, 'First name must be at least 2 characters')
  .max(50, 'First name too long')
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'First name contains invalid characters');

export const lastNameSchema = z
  .string()
  .min(2, 'Last name must be at least 2 characters')
  .max(50, 'Last name too long')
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Last name contains invalid characters');

export const registerSchema = z.object({
  firstName: firstNameSchema,
  lastName:  lastNameSchema,
  email:     emailSchema,
  phone:     phoneSchema,
  password:  passwordSchema,
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email:    emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const weightSchema = z
  .number()
  .positive('Weight must be positive')
  .max(50, 'Maximum 50 kg');

export function getFirstZodError(
  result: z.ZodSafeParseResult<unknown>,
): string | null {
  if (result.success) return null;
  return result.error.issues[0]?.message ?? 'Validation error';
}
