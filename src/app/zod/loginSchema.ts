
import { z } from 'zod';

export const userSchema = z.object({
    username: z.string().min(3, 'שם המשתמש חייב להכיל לפחות 3 תווים'),
    password: z.string().min(6, "Password must be at least 6 characters"),
});
export type UserFormData = z.infer<typeof userSchema>;


// סכימה לשלב 2: אימות OTP
export const otpSchema = z.object({
    otp: z.string().min(6, 'ה-OTP חייב להכיל לפחות 6 תווים'),
});
export type OtpFormData = z.infer<typeof otpSchema>;


