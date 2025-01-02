import { z } from 'zod';

export const userNameSchema = z.object({
    username: z.string().min(3, 'שם המשתמש חייב להכיל לפחות 3 תווים'),
});
export type UserNameFormData = z.infer<typeof userNameSchema>;


export const otpSchema = z.object({
    otp: z.string().min(6, 'ה-OTP חייב להכיל לפחות 6 תווים'),
});
export type OtpFormData = z.infer<typeof otpSchema>;


export const resetPasswordSchema = z.object({
    newPassword: z.string().min(6, 'הסיסמה החדשה חייבת להכיל לפחות 6 תווים'),
    confirmPassword: z.string().min(6, 'אימות הסיסמה חייב להכיל לפחות 6 תווים'),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: 'הסיסמאות לא תואמות',
    path: ['confirmPassword'],
});
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

