
// export const resetPasswordSchema = (step: number) => {
//   let schema = z.object({
//     email: z.string().email('Invalid email address'),
//   });

//   // שלב 2 - הוספת OTP
//   if (step >= 2) {
//     schema = schema.extend({
//         otp: z.string().min(6, 'OTP must be 6 digits').max(6),
//       });
//   }

//   // שלב 3 - הוספת שם משתמש וסיסמה
//   if (step >= 3) {
//     schema = schema.extend({
//         username: z.string().min(3, 'Username must be at least 3 characters'),
//         newPassword: z.string().min(8, 'Password must be at least 8 characters'),
//         confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
//       })
//   .refine((data) => data.newPassword === data.confirmPassword, {
//     message: "Passwords don't match",
//     path: ['confirmPassword'],
//   });
//   }
//   return schema;
// };

// export type ResetFormData = z.infer<ReturnType<typeof resetPasswordSchema>>;

import { z } from 'zod';

// סכימה לשלב 1: אימות אימייל
export const userNameSchema = z.object({
    username: z.string().min(3, 'שם המשתמש חייב להכיל לפחות 3 תווים'),
});
export type UserNameFormData = z.infer<typeof userNameSchema>;


// סכימה לשלב 2: אימות OTP
export const otpSchema = z.object({
    otp: z.string().min(6, 'ה-OTP חייב להכיל לפחות 6 תווים'),
});
export type OtpFormData = z.infer<typeof otpSchema>;


// סכימה לשלב 3: איפוס סיסמה
export const resetPasswordSchema = z.object({
    newPassword: z.string().min(6, 'הסיסמה החדשה חייבת להכיל לפחות 6 תווים'),
    confirmPassword: z.string().min(6, 'אימות הסיסמה חייב להכיל לפחות 6 תווים'),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: 'הסיסמאות לא תואמות',
    path: ['confirmPassword'],
});
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

