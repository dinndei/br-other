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
import toast from 'react-hot-toast';

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
            const email = response.user.email
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
                toast.success("סיסמה שונתה בהצלחה")
                router.push('/pages/user/login'); 
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        catch (error) {
            setError('Error resetting password. Please try again.');
        }
    };




    return (
        <div className="relative flex justify-center items-center min-h-screen bg-gray-100">
            {/* רקע מותאם */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-white to-blue-300 z-0">
                <div className="absolute inset-0 bg-opacity-30">
                    <div className="absolute inset-0 blur-3xl opacity-60 bg-gradient-to-t from-blue-200 via-white to-blue-100 rounded-full mix-blend-multiply"></div>
                </div>
            </div>
            <div className="relative z-10 w-full max-w-md p-8 bg-white rounded-lg shadow-lg" >
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {step === 1 && (
                    <form onSubmit={handleSubmitUserNameForm(handleSubmitUserName)}>
                        <input
                            type="text"
                            placeholder="שם משתמש"
                            {...registerUserName('username', { required: "הכנס שם משתמש" })}
                            className="w-full px-4 py-2 mt-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {userNameErrors.username && <p className="text-red-500">{userNameErrors.username.message}</p>}
                        <button type="submit"
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            שלח לי קוד OTP
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleSubmitOtpForm(handleVerifyOtp)}>
                        <label>{maskedEmail} נשלח אלייך קוד חד פעמי למייל </label>
                        <input
                            type="text"
                            placeholder="הכנס את ה-OTP"
                            {...registerOtp('otp')}
                            className="w-full px-4 py-2 mt-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {otpErrors.otp && <p className="text-red-500">{otpErrors.otp.message}</p>}
                        <button type="submit"
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" >                            אמת OTP
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
                        <button type="submit"
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"                        >
                            אפס סיסמה
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;

