'use client'
import { useState } from 'react';
import { findUserByUsername, resetPassword, sendOtpCode } from '@/app/actions/userActions';
import PasswordInput from '@/app/components/PasswordInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { userNameSchema, otpSchema, resetPasswordSchema } from '@/app/zod/resetPaasword';
import { useForm } from 'react-hook-form';
import { verifyOTP } from '@/app/actions/userActions';
import { UserNameFormData, OtpFormData, ResetPasswordFormData } from '@/app/zod/resetPaasword';

import { useRouter } from 'next/navigation';
import { useUserForResetStore } from '@/app/store/resetPasswordStore';
import { maskEmail } from '@/app/lib/dataEncryption/encryptEmail';

const ResetPassword = () => {
    const [step, setStep] = useState(1); // Step 1: Enter OTP, Step 2: Enter new password
    const [error, setError] = useState('');
    const [maskedEmail, setMaskEmail] = useState('');
    const setUsername = useUserForResetStore((state) => state.setUsernameForReset);
    const nameForReset = useUserForResetStore((state) => state.usernameForReset);
    const setEmailForReset = useUserForResetStore((state) => state.setEmailForReset);
    const emailForReset = useUserForResetStore((state) => state.emailForReset);


    const { register: registerUserName, handleSubmit: handleSubmitUserNameForm, formState: { errors: userNameErrors } } = useForm<UserNameFormData>({
        resolver: zodResolver(userNameSchema),
    });

    const { register: registerOtp, handleSubmit: handleSubmitOtpForm, formState: { errors: otpErrors } } = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
    });

    const { register: registerReset, handleSubmit: handleSubmitResetForm, formState: { errors: resetErrors } } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const router = useRouter();

    const handleSubmitUserName = async (data: UserNameFormData) => {
        setUsername(data.username)
        try {
            const response = await findUserByUsername(data.username);
            const email = response.email
            if (response.success) {
                console.log("response.email", email);
                setEmailForReset(email);
                console.log("Store email state:", useUserForResetStore.getState().emailForReset);
                const tempMask = maskEmail(email!);
                setMaskEmail(tempMask)
                try {


                    const response = await sendOtpCode(email);
                    if (response.success) {
                        console.log('נמצא מייל');
                    }
                    else {
                        setError(response.message);
                    }
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                catch (error) {
                    setError('לא נמצא שם משתמש . אנא נסה שוב.');
                }
                setStep(2);
            } else {
                setError(response.message);
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        catch (error) {
            setError('לא נמצא מייל תואם . אנא נסה שוב.');
        }
    };

    const handleVerifyOtp = async (data: OtpFormData) => {
        console.log("data.otp", data.otp);
        console.log("EmailForReset!", emailForReset!);

        try {
            const response = await verifyOTP(emailForReset!, data.otp)
            if (response.success) {
                setStep(3);
            }
            else {
                setError(response.message)
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        catch (error) {
            setError('שגיאה במהלך אימות הקוד. אנא נסה שנית.');
        }
    };

    const handleResetPassword = async (data: ResetPasswordFormData) => {
        if (data.newPassword !== data.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        try {
            const response = await resetPassword(nameForReset!, data.newPassword);
            console.log("page response", response);

            if (response.data) {
                console.log("Password reset successful");
                router.push('/'); // ניתוב לדף הבית
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        catch (error) {
            setError('Error resetting password. Please try again.');
        }
    };




    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {step === 1 && (
                    <form onSubmit={handleSubmitUserNameForm(handleSubmitUserName)}>
                        <input
                            type="text"
                            placeholder="שם משתמש"
                            {...registerUserName('username', { required: "הכנס שם משתמש" })}
                        />
                        {userNameErrors.username && <p className="text-red-500">{userNameErrors.username.message}</p>}
                        <button type="submit" className="w-full bg-blue-500 text-white rounded py-2">
                            send OTP code
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleSubmitOtpForm(handleVerifyOtp)}>
                        <label> נשלח אלייך קוד חד פעמי למייל {maskedEmail}</label>
                        <input
                            type="text"
                            placeholder="הכנס את ה-OTP"
                            {...registerOtp('otp')}
                        />
                        {otpErrors.otp && <p className="text-red-500">{otpErrors.otp.message}</p>}
                        <button type="submit" className="w-full bg-blue-500 text-white rounded py-2">
                            אמת OTP
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleSubmitResetForm(handleResetPassword)}>
                        <PasswordInput
                            name="newPassword"
                            placeholder="הכנס סיסמה חדשה"
                            register={registerReset}
                            error={resetErrors.newPassword?.message}
                        />
                        <PasswordInput
                            name="confirmPassword"
                            placeholder="אמת סיסמה חדשה"
                            register={registerReset}
                            error={resetErrors.confirmPassword?.message}

                        />

                        {resetErrors.confirmPassword && <p className="text-red-500">{resetErrors.confirmPassword.message}</p>}
                        {resetErrors.newPassword && <p className="text-red-500">{resetErrors.newPassword.message}</p>}
                        <button type="submit" className="w-full bg-blue-500 text-white rounded py-2">
                            אפס סיסמה
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;

