
import { z } from 'zod';

export const resetPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
    otp: z.string().min(6, 'OTP must be 6 digits').max(6),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],

});

export type ResetFormData = z.infer<typeof resetPasswordSchema>;
