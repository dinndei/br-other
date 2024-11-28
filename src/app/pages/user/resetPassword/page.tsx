'use client'
import { useState } from 'react';
import { resetPassword, sendOTPCode } from '@/app/actions/userActions';
import PasswordInput from '@/app/components/PasswordInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetFormData, resetPasswordSchema } from '@/app/zod/resetPaasword';
import { useForm } from 'react-hook-form';
import { verifyOTP } from '@/app/lib/otp/verifyCode';

// import { useRouter } from 'next/router';

const ResetPassword = () => {

    const { register, handleSubmit, formState: { errors } } = useForm<ResetFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });


    const [step, setStep] = useState(1); // Step 1: Enter OTP, Step 2: Enter new password
    const [error, setError] = useState('');
    //   const router = useRouter();

    const handleSubmitEmail = async (data: ResetFormData) => {
        
        console.log("comming to submit");
        
        try {
            const response = await sendOTPCode(data.email);
            if (response.success) {
                setStep(2);
                console.log('OTP נשלח בהצלחה');
            } else {
                setError(response.message);
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        catch (error) {
            setError('שגיאה בשליחת ה-OTP. אנא נסה שוב.');
        }
    };

    const handleVerifyOtp = async (data: ResetFormData) => {
        try {
            const response = await verifyOTP(data.email, data.otp)
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

    const handleResetPassword = async (data: ResetFormData) => {
        if (data.newPassword === data.confirmPassword) {
            try {
                const response = await resetPassword(data.username, data.newPassword)
                console.log("page response", response);

                if (response === 'Password reset successfully') {
                    console.log("Password reset successful");
                    window.location.href = '/'    //ניתוב לדף הבית
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            catch (error) {
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
                   
                    <form onSubmit={handleSubmit(handleSubmitEmail)}>
                        <input
                            type="email"
                            placeholder="הכנס אימייל"
                            {...register('email', { required: "הכנס אימייל" })}
                        />
                        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                        <button type="submit" className="w-full bg-blue-500 text-white rounded py-2">
                            send OTP code
                        </button>
                    </form>
                )}

                {step === 2 && (
                    
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
