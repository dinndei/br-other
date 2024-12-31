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


// import FieldsInputList from "@/app/components/FieldsInputList";

const SignupForm = () => {

    const [uploading, setUploading] = useState(false);

    const router = useRouter();
    const storeUser = useUserStore((st) => st.user);

    const login = useUserStore((state) => state.login);
    const [fields, setFields] = React.useState<IField[]>([{ mainField: "", subField: "" }]);

    const { register, setValue, handleSubmit, formState: { errors } } = useForm<SignupFormData>

        ({
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
                    religionLevel: ReligionLevel.Orthodox,
                    politicalAffiliation: PoliticalAffiliation.CenterRight,
                }
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

            if (userData)
                console.log('User signed up successfully:', userData);
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
        <div >

            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 space-y-4">
                <div>
                    <label htmlFor="firstName" className="block font-medium">First Name</label>
                    <input
                        id="firstName"
                        {...register("firstName")}
                        className="w-full border border-gray-300 p-2 rounded"
                    />
                    {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
                </div>

                <div>
                    <label htmlFor="lastName" className="block font-medium">Last Name</label>
                    <input
                        id="lastName"
                        {...register("lastName")}
                        className="w-full border border-gray-300 p-2 rounded"
                    />
                    {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
                </div>

                <div>
                    <label htmlFor="userName" className="block font-medium">Username</label>
                    <input
                        id="userName"
                        {...register("userName")}
                        className="w-full border border-gray-300 p-2 rounded"
                    />
                    {errors.userName && <p className="text-red-500">{errors.userName.message}</p>}
                </div>

                <div>
                    <label htmlFor="profileImage">Profile Image</label>
                    <input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange} // פונקציה נפרדת להעלאת התמונה
                    />
                    {uploading && <p>Uploading image...</p>}
                </div>

                <div>
                    <label htmlFor="age" className="block font-medium">Age</label>
                    <input
                        id="age"
                        type="number"
                        {...register("age", { valueAsNumber: true })}
                        className="w-full border border-gray-300 p-2 rounded"
                    />
                    {errors.age && <p className="text-red-500">{errors.age.message}</p>}
                </div>

                <div>
                    <label htmlFor="email" className="block font-medium">Email</label>
                    <input
                        id="email"
                        {...register("email")}
                        className="w-full border border-gray-300 p-2 rounded"
                    />
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                </div>

                <div>
                    <label htmlFor="password" className="block font-medium">Password</label>
                    <input
                        id="password"
                        type="password"
                        {...register("password")}
                        className="w-full border border-gray-300 p-2 rounded"
                    />
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                </div>

                <div>
                    <label htmlFor="gender" className="block font-medium">Gender</label>
                    <select
                        id="gender"
                        {...register("gender")}
                        className="w-full border border-gray-300 p-2 rounded"
                    >
                        <option value="">Select Gender</option>
                        {Object.values(Gender).map((g) => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                    {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}
                </div>

                <div>
                    <FieldsInputList fields={fields} setFields={setFields} showEditButtons={true}/>
                    {errors.fields && <p className="text-red-500">{errors.fields.message}</p>}
                </div>
                <div>
                    <label htmlFor="religionLevel" className="block font-medium">Religion Level</label>
                    <select
                        id="religionLevel"
                        {...register("typeUser.religionLevel")}
                        className="w-full border border-gray-300 p-2 rounded"
                    >
                        <option value="">Select Religion Level</option>
                        {Object.values(ReligionLevel).map((rl) => (
                            <option key={rl} value={rl}>{rl}</option>
                        ))}
                    </select>
                    {errors.typeUser?.religionLevel && <p className="text-red-500">{errors.typeUser.religionLevel.message}</p>}
                </div>

                <div>
                    <label htmlFor="politicalAffiliation" className="block font-medium">Political Affiliation</label>
                    <select
                        id="politicalAffiliation"
                        {...register("typeUser.politicalAffiliation")}
                        className="w-full border border-gray-300 p-2 rounded"
                    >
                        <option value="">Select Political Affiliation</option>
                        {Object.values(PoliticalAffiliation).map((pa) => (
                            <option key={pa} value={pa}>{pa}</option>
                        ))}
                    </select>
                    {errors.typeUser?.politicalAffiliation && <p className="text-red-500">{errors.typeUser.politicalAffiliation.message}</p>}
                </div>


                <Button
                    type="submit"
                    className="w-full"
                >
                    Submit
                </Button>
            </form>
        </div>

    );
};

export default SignupForm;
