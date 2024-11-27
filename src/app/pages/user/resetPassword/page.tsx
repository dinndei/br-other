'use client'
import { useState } from 'react';
import { sendCode } from '@/app/lib/otp/otpCode';
import { resetPassword } from '@/app/actions/userActions';
import PasswordInput from '@/app/components/PasswordInput';
import Input from '@/app/components/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetFormData, resetPasswordSchema } from '@/app/zod/resetPaasword';
import { useForm } from 'react-hook-form';

// import { useRouter } from 'next/router';

const ResetPassword = () => {

    const { register, handleSubmit, formState: { errors }} = useForm<ResetFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });


    const [sendedOtp, setSendedOtp] = useState('')
    const [step, setStep] = useState(1); // Step 1: Enter OTP, Step 2: Enter new password
    const [error, setError] = useState('');
    //   const router = useRouter();

    const handleSubmitEmail = async (data: ResetFormData) => {
        try {
            const otp_code = await sendCode(data.email)
            setSendedOtp(otp_code)
            console.log("bgyuv", sendedOtp);

            if (otp_code) {
                setStep(2); // Move to next step: Enter OTP
            }
        } catch (error) {
            setError('Error sending OTP. Please try again.');
        }
    };

    const handleVerifyOtp = async (data: ResetFormData) => {
        try {
            if (sendedOtp == data.otp) {
                setStep(3);
            }
        } catch (error) {
            setError('Invalid OTP. Please try again.');
        }
    };

    const handleResetPassword = async (data: ResetFormData) => {
        if (data.newPassword === data.confirmPassword) {
            try {
                const response = await resetPassword(data.username, data.newPassword)
                console.log("page response", response);

                if (response === 'Password reset successfully') {
                    console.log("Password reset successful");
                    window.location.href = '/'    //ניתוב לדף הבית
                }
            } catch (error) {
                setError('Error resetting password. Please try again.');
            }
        }
        else {
            setError('Passwords do not match.');
        }
    };


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

                {errors.root && <div className="text-red-500 mb-4">{errors.root.message}</div>}

                {step === 1 && (
                    // <div>
                    //     <input
                    //         type="email"
                    //         placeholder="Enter your email"
                    //         {...register('email')}
                    //     />
                    //     {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                    //     <button
                    //         onClick={handleSubmitEmail}
                    //         className="w-full px-4 py-2 bg-blue-500 text-white rounded"
                    //     >
                    //         Send OTP
                    //     </button>
                    // </div>
                    <form onSubmit={handleSubmit(handleSubmitEmail)}>
                        <input
                            type="email"
                            placeholder="הכנס אימייל"
                            {...register('email')}
                        />
                        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                        <button type="submit" className="w-full bg-blue-500 text-white rounded py-2">
                            send OTP code
                        </button>
                    </form>
                )}

                {step === 2 && (
                    // <div>
                    //     <input
                    //         type="text"
                    //         placeholder="Enter the OTP"
                    //         {...register('otp')}
                    //     />
                    //     {errors.otp && <p className="text-red-500">{errors.otp.message}</p>}

                    //     <button
                    //         onClick={handleVerifyOtp}
                    //         className="w-full px-4 py-2 bg-blue-500 text-white rounded"
                    //     >
                    //         Verify OTP
                    //     </button>
                    // </div>
                    <form onSubmit={handleSubmit(handleVerifyOtp)}>
                        <input
                            type="text"
                            placeholder="הכנס את ה-OTP"
                            {...register('otp')}
                        />
                        {errors.otp && <p className="text-red-500">{errors.otp.message}</p>}
                        <button type="submit" className="w-full bg-blue-500 text-white rounded py-2">
                            אמת OTP
                        </button>
                    </form>
                )}

                {step === 3 && (
                    // <div>
                    //     <input
                    //         type="username"
                    //         placeholder="Enter your username"
                    //         {...register('username')}
                    //     />
                    //     {errors.username && <p className="text-red-500">{errors.username.message}</p>}

                    //     {/* <PasswordInput password={newPassword} setPassword={setNewPassword} placeholder={"Enter new password"} />
                    //     <PasswordInput password={confirmPassword} setPassword={setConfirmPassword} placeholder={"Confirm new password"} /> */}

                    //     <PasswordInput
                    //         placeholder="Enter new password"
                    //         {...register('newPassword')}
                    //     />
                    //     {errors.newPassword && <p className="text-red-500">{errors.newPassword.message}</p>}

                    //     <PasswordInput
                    //         placeholder="Confirm new password"
                    //         {...register('confirmPassword')}
                    //     />
                    //     {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
                    //     <button
                    //         onClick={handleResetPassword}
                    //         className="w-full px-4 py-2 bg-blue-500 text-white rounded"
                    //     >
                    //         Reset Password
                    //     </button>
                    // </div>
                    <form onSubmit={handleSubmit(handleResetPassword)}>
                        <input
                            type="text"
                            placeholder="הכנס שם משתמש"
                            {...register('username')}
                        />
                        {errors.username && <p className="text-red-500">{errors.username.message}</p>}
                        <PasswordInput
                            name="password"
                            placeholder="הכנס סיסמה חדשה"
                            register={register}
                            error={errors.newPassword?.message}
                        />
                        <PasswordInput
                            name="password"
                            placeholder="אמת סיסמה חדשה"
                            register={register}
                            error={errors.confirmPassword?.message}

                        />

                        {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
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

// אפשרות לשימוש בקופוננטה BUTTON במקום בקישורים הנעביכים האלה

// const router = useRouter();

//   const goToSignup = () => {
//     router.push('/pages/user/signup');
//   };

//   const goToResetPassword = () => {
//     router.push('/pages/user/resetPassword');
//   };

//   return (
//     <div className="flex flex-col items-center gap-4 mt-4">
//       <Button onClick={goToSignup} className="w-full bg-indigo-600 hover:bg-indigo-800">
//         צור חשבון חדש
//       </Button>

//       <Button onClick={goToResetPassword} className="w-full bg-indigo-600 hover:bg-indigo-800">
//         שכחתי סיסמה
//       </Button>
//     </div>
//   );
// };
