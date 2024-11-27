'use client'
import { loginUser } from '@/app/actions/userActions';
import PasswordInput from '@/app/components/PasswordInput';
import { LoginFormData, loginSchema } from '@/app/zod/loginSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const LoginPage = () => {


    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    });

    // const handleLogin = async (e: React.FormEvent) => {
    //     e.preventDefault();

    //     if (!userName || !password) {
    //         setError('נא למלא את כל השדות');
    //         return;
    //     }

    //     try {
    //         const isValid = await loginUser(userName, password);

    //         if (isValid) {
    //             console.log('ההתחברות בוצעה בהצלחה');
    //         } else {
    //             setError('שם משתמש או סיסמה שגויים');
    //         }
    //     } catch (error) {
    //         setError('שגיאה במהלך ההתחברות');
    //     }
    // };

    const onSubmit = async (data: LoginFormData) => {
        try {
            const isValid = await loginUser(data.userName, data.password);
            if (isValid) {
                console.log('ההתחברות בוצעה בהצלחה');
            } else {
                alert('שם משתמש או סיסמה שגויים');
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        catch (error) {
            alert('שגיאה במהלך ההתחברות');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-6">התחברות</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            שם משתמש
                        </label>
                        <input
                            type="text"
                            id="username"
                            {...register('userName')}
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="הכנס שם משתמש"
                        />
                        {errors.userName && <p className="text-red-500 text-sm">{errors.userName.message}</p>}
                    </div>
                    <PasswordInput
                        name="password"
                        placeholder="הכנס סיסמה"
                        register={register}
                        error={errors.password?.message}
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

                    <div className="flex justify-between items-center">
                        <button
                            type="submit"
                            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            התחבר
                        </button>
                    </div>

                    <div className="mt-4 text-center text-sm">
                        <a href="/pages/user/signup" className="text-indigo-600 hover:text-indigo-800">
                            צור חשבון חדש
                        </a>
                    </div>
                    <div className="mt-2 text-center text-sm">
                        <a href="/pages/user/resetPassword" className="text-indigo-600 hover:text-indigo-800">
                            שכחתי סיסמה
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
