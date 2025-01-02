'use client'
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormData, signupSchema } from "@/app/zod/signInSchema";
import { Gender } from "@/app/types/enums/gender";
import { ReligionLevel } from "../../../types/enums/ReligionLevel";
import { PoliticalAffiliation } from "@/app/types/enums/politicalAffiliation";
import Button from "@/app/components/Button";
import { signupUser } from "@/app/actions/userActions";
import { useUserStore } from "@/app/store/userStore";
import IUser from "@/app/types/IUser";
import FieldsInputList from "@/app/components/FieldsInputList";
import IField from "@/app/types/IField";
import axios from "axios";
import toast from "react-hot-toast";


// import FieldsInputList from "@/app/components/FieldsInputList";

const SignupForm = () => {

    const [uploading, setUploading] = useState(false);

    const router = useRouter();
    const storeUser = useUserStore((st) => st.user);

    const login = useUserStore((state) => state.login);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [fields, setFields] = React.useState<IField[]>([{ mainField: "", subField: "" }]);

    const { register, setValue, handleSubmit, formState: { errors, isValid } } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        mode: "onChange",
        defaultValues: {
            firstName: "",
            lastName: "",
            userName: "",
            age: 0,
            email: "",
            password: "",
            gender: Gender.Male,
            fields: fields,
            typeUser: {
                religionLevel: undefined,
                politicalAffiliation: undefined,
            },
             acceptTerms: false
        },
    });


    useEffect(() => {
        setValue("fields", fields);
    }, [fields, setValue]);

    useEffect(() => {
        console.log("Updated user in store EFFECT:", storeUser);
    }, [storeUser]);

    // const uploadImage = async (file: File) => {
    //     setUploading(true);
    //     const formData = new FormData();
    //     formData.append('file', file);
    //     formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    //     try {
    //         // העלאת התמונה ל-Cloudinary
    //         const response = await axios.post(
    //             `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    //             formData
    //         );

    //         // קבלת ה-URL של התמונה
    //         const uploadedImageUrl = response.data.secure_url;

    //         return uploadedImageUrl; // מחזיר את ה-URL של התמונה
    //     } catch (error) {
    //         console.error("Error uploading image:", error);
    //         return null;
    //     } finally {
    //         setUploading(false);
    //     }
    // };

    const uploadImage = async (file: File): Promise<string | undefined> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

        try {
            setUploading(true);
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                formData
            );
            setUploading(false);
            return response.data.secure_url; // URL של התמונה שהועלתה
        } catch (error) {
            console.error("Error uploading image:", error);
            setUploading(false);
            return undefined;
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = await uploadImage(file);
            if (imageUrl) {
                setValue("profileImage", imageUrl); // שמור את ה-URL של התמונה בטופס
            }
        }
    };

    const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
        console.log("data on submit", data);

        try {
            const userData = await signupUser(data);
            console.log("user data on submit", userData);

            if (userData){
                console.log('User signed up successfully:', userData);
                toast.success("נרשמת בהצלחה")

            }
            const user = (userData as { user: IUser }).user;
            const token = (userData as { user: IUser, token: string }).token;

            console.log("user before store", user);

            // שולח ללוגין במקום setUser
            login(user, token);

            console.log("user after store", storeUser);
            router.push('/')

        } catch (error) {
            console.error('Error signing up:', error);
        }

    };

    return (
        <div className="relative w-full h-screen bg-gradient-to-br from-blue-500 via-white to-blue-300">
            <div className="relative z-50 py-8 px-4 mt-16 w-full flex justify-center items-start">
                <div
                    className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md space-y-6 overflow-y-auto relative max-h-[calc(100vh-4rem)]"
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
                        <h2 className="text-center text-xl font-semibold mb-6 text-right">...כמה פרטים ונתחיל</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="firstName" className="block text-right font-medium">שם פרטי</label>
                                <input
                                    id="firstName"
                                    {...register("firstName")}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-right font-medium">שם משפחה</label>
                                <input
                                    id="lastName"
                                    {...register("lastName")}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="userName" className="block text-right font-medium">שם משתמש</label>
                                <input
                                    id="userName"
                                    {...register("userName")}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.userName && <p className="text-red-500 text-sm">{errors.userName.message}</p>}
                            </div>

                            <div dir="rtl">
                                <label htmlFor="profileImage" className="block text-right font-medium">תמונת פרופיל</label>
                                <input
                                    id="profileImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-gray-100 text-right"
                                />
                                {uploading && <p className="text-blue-500 text-sm text-right">Uploading image...</p>}
                            </div>

                            <div>
                                <label htmlFor="age" className="block text-right font-medium">גיל</label>
                                <input
                                    id="age"
                                    type="number"
                                    {...register("age", { valueAsNumber: true })}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                                />
                                {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-right font-medium">אימייל</label>
                                <input
                                    id="email"
                                    {...register("email")}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-right font-medium">סיסמה</label>
                                <input
                                    id="password"
                                    type="password"
                                    {...register("password")}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="gender" className="block text-right font-medium">מין</label>
                                <select
                                    id="gender"
                                    {...register("gender")}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                                >
                                    <option value="">Select Gender</option>
                                    {Object.values(Gender).map((g) => (
                                        <option key={g} value={g}>{g}</option>
                                    ))}
                                </select>
                                {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
                            </div>

                            <div>
                                <FieldsInputList fields={fields} setFields={setFields} showEditButtons={true} />
                                {errors.fields && <p className="text-red-500 text-sm">{errors.fields.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="religionLevel" className="block text-right font-medium">זיקה דתית</label>
                                <select
                                    id="religionLevel"
                                    {...register("typeUser.religionLevel")}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                                >
                                    <option value="">בחר זיקה דתית</option>
                                    {Object.values(ReligionLevel).map((rl) => (
                                        <option key={rl} value={rl}>{rl}</option>
                                    ))}
                                </select>
                                {errors.typeUser?.religionLevel && <p className="text-red-500 text-sm">{errors.typeUser.religionLevel.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="politicalAffiliation" className="block text-right font-medium">נטייה פוליטית</label>
                                <select
                                    id="politicalAffiliation"
                                    {...register("typeUser.politicalAffiliation")}
                                    className="w-full border border-gray-300 p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                                >
                                    <option value="">בחר נטייה פוליטית</option>
                                    {Object.values(PoliticalAffiliation).map((pa) => (
                                        <option key={pa} value={pa}>{pa}</option>
                                    ))}
                                </select>
                                {errors.typeUser?.politicalAffiliation && <p className="text-red-500 text-sm">{errors.typeUser.politicalAffiliation.message}</p>}
                            </div>

                            {/* Checkbox Section */}
                            <div className="flex items-center space-x-3 justify-start" dir="rtl">
                                <input
                                    id="acceptTerms"
                                    type="checkbox"
                                    className="w-5 h-5"
                                    {...register("acceptTerms", { required: "עליך לקרוא ולהסכים לכללי האתר" })}
                                />
                                <label htmlFor="acceptTerms" className="text-sm text-right">קראתי והבנתי את</label>
                                <button
                                    type="button"
                                    onClick={openModal}
                                    className="text-blue-500 underline text-right"
                                >
                                    כללי האתר
                                </button>
                            </div>

                            <Button
                                type="submit"
                                className={`w-full ${!isValid ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white font-bold py-3 px-6 rounded-lg`}
                                disabled={!isValid}
                            >
                                🤗 סיימתי
                            </Button>
                        </div>
                    </form>

                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                                <h2 className="text-xl font-bold mb-4 text-right">כללי האתר</h2>
                                <p className="text-sm text-gray-700 mb-4 text-right">
                                    ברוך הבא לאתר שלנו! מטרתנו היא להעניק לך את האפשרות להעשיר את הידע שלך ולתרום לקהילה במקביל.
                                    על מנת לשמור על איזון, תוכל לנהל עד שני קורסים פעילים בו-זמנית: אחד כמלמד ואחד כמתלמד.
                                    <br /><br />
                                    במידה שתתבקש ללמד, תוכל לסרב אם הדבר אינו מתאים לך באותו רגע. עם זאת, חשוב לזכור כי אם מספר הסירובים שלך יעלה על מספר הקורסים שבהם השתתפת כמתלמד, לא תוכל להגיש בקשה חדשה ללמידה.
                                    ברגע שתאשר קורס ללימוד, כל הסירובים שצברת יתאפסו.
                                    <br /><br />
                                    אנו מבקשים לשמור על שיח מכבד והוגן בכל עת. יחד נוכל ליצור קהילה לומדת ותומכת שמקדמת את כולנו קדימה.
                                </p>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={closeModal}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-left"
                                    >
                                        אישור
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>

    );
};

export default SignupForm;
