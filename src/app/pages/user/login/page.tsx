'use client'
import { loginUser, sendOtpCode, verifyOTP } from '@/app/actions/userActions';
import PasswordInput from '@/app/components/PasswordInput';
import { OtpFormData, otpSchema, UserFormData, userSchema } from '@/app/zod/loginSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUserStore } from '@/app/store/userStore';
import { resetActiveRequest } from '@/app/actions/findMentorAction';

const LoginPage = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    // const [tempUser, setTempUser] = useState<Partial<IUser>>({});
    const [tempToken, setTempToken] = useState("")
    // const [tempEmail, setTempEmail] = useState("")
    const login = useUserStore((state) => state.login);
    const setUser = useUserStore((state) => state.setUser);
    const user = useUserStore((state) => state.user);


    const { register: registerUser, handleSubmit: handleSubmitUserForm, formState: { errors: userErrors } } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
    });

    const { register: registerOtp, handleSubmit: handleSubmitOtpForm, formState: { errors: otpErrors } } = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
    });


    const handleLoginSubmit = async (data: UserFormData) => {
        const response = await loginUser(data.username, data.password);
        if (response.status == 200) {
            setUser(response.user);
            setTempToken(response.token)
            try {
                const res = await sendOtpCode(response.user.email);
                if (res.success) {
                    setStep(2);
                }

            }
            catch (error) {
                console.error(error);
            }

        } else if(response.status == 404){
            alert("משתמש לא נמצא");
        }
    else{
        //wrong password
        //אם יש סיסמא לא נכונה נבלבל אותו....
        alert("נתקלנו בבעיה, נסה שוב מאוחר יותר")
    }
    };

    // שלב שני: אימות קוד
    const handleOtpSubmit = async (data: OtpFormData) => {

       console.log("user.email", user?.email);
        try {
            const response = await verifyOTP(user!.email!, data.otp)
            if (response.success) {
                login(user!, tempToken)
                if (user!.learningApprovalPending !== null) {
                    alert("יש לך בקשת למידה שממתינה לאישור. מעבירים אותך לדף האישור.");
                    router.push('/pages/user/learning-approval'); // ניתוב לעמוד האישור
                } else {
                    if (user!.activeLearningRequestPending !== null) {
                        alert("יש לך למידה שאושרה, מעבירים אותך לקורס");
                        await resetActiveRequest((user!._id) as string)

                        router.push(`/pages/user/activCourse/${user!.activeLearningRequestPending}`) // ניתוב לקורס
                    } else {
                        router.push('/'); // מעבר לדף הבית אם אין בקשת למידה ממתינה
                    }
                }
            }
            else {
                alert("קוד ה-OTP שגוי. אנא נסה שוב.");
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        catch (error) {
            console.error(otpErrors.otp)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-6">התחברות</h2>
                {step === 1 && (
                    <form onSubmit={handleSubmitUserForm(handleLoginSubmit)} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                שם משתמש
                            </label>
                            <input
                                type="text"
                                id="username"
                                {...registerUser('username')}
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="הכנס שם משתמש"
                            />
                            {userErrors.username && <p className="text-red-500 text-sm">{userErrors.username.message}</p>}
                        </div>
                        <PasswordInput<UserFormData>
                            name="password"
                            placeholder="הכנס סיסמה"
                            register={registerUser}
                            error={userErrors.password?.message}
                        />

                        <div className="flex justify-between items-center">
                            <button
                                type="submit"
                                className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                התחבר
                            </button>
                        </div>

                        <div className="flex justify-between mt-4">
                            <button
                                type="button"
                                onClick={() => router.push('/pages/user/signup')}
                                className="text-indigo-500 underline"
                            >
                                צור חשבון חדש
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/pages/user/resetPassword')}
                                className="text-indigo-500 underline"
                            >
                                שכחתי סיסמה
                            </button>
                        </div>

                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleSubmitOtpForm(handleOtpSubmit)}>
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
            </div>
        </div>
    );
};

export default LoginPage;
