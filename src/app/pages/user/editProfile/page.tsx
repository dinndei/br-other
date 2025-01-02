'use client'
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "@/app/store/userStore";
import { editUser } from "@/app/actions/userActions";
import Button from "@/app/components/Button";
import { ReligionLevel } from "@/app/types/enums/ReligionLevel";
import { PoliticalAffiliation } from "@/app/types/enums/politicalAffiliation";
import { Gender } from "@/app/types/enums/gender";
import { EditProfFormData, editProfSchema } from "@/app/zod/editProfSchema";
import IField from "@/app/types/IField";
import FieldsInputList from "@/app/components/FieldsInputList";
import { useRouter } from "next/navigation";
import IUser from "@/app/types/IUser";
import axios from "axios";
import ProfileImage from "@/app/components/ProfileImage";
import toast from "react-hot-toast";



const EditUserForm = () => {

    const [uploading, setUploading] = useState(false);

    const router = useRouter();
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const [fields, setFields] = useState<IField[]>(user?.fields || []);
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<EditProfFormData>({
        resolver: zodResolver(editProfSchema),
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            userName: user?.userName || "",
            age: user?.age || 0,
            email: user?.email || "",
            gender: user?.gender || Gender.Other,
            fields: fields,
            typeUser: user?.typeUser || {
                politicalAffiliation: undefined,
                religionLevel: undefined,
            },
            profileImage: "@/profile.png"
        },
    });

    useEffect(() => {
        setValue("fields", fields);
    }, [fields, setValue]);

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
                setValue("profileImage", imageUrl);
            }
        }
    };

    const onSubmit: SubmitHandler<EditProfFormData> = async (data) => {
        try {
            if (user) {
                const updatedUser = await editUser(String(user._id), data);
                if (updatedUser)
                    console.log("user ypdated", updatedUser);
                const newUser = (updatedUser as { user: IUser }).user;
                setUser(newUser);
                router.push('/')
                console.log("user", user);
                toast.success("הפרטים עודכנו בהצלחה")
}
            else {
                toast('משתמש לא נמצא', {
                    icon: '😔',
                  });
            }
        } catch (error) {
            console.error("Error updating user:", error);
         toast.error("לצערנו העדכון נכשל")
        }
    };



    return (
        
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md space-y-6 mt-20" dir="rtl">
            <div className="flex items-center space-x-4 mb-6">
                <ProfileImage url={user?.profileImage} firstName={user?.firstName} size="large" />
                <div>
                    <h2 className="text-lg font-bold">שלום, {user?.firstName}</h2>
                    <p className="text-sm text-gray-600">ערוך את פרטי החשבון שלך כאן</p>
                </div>
            </div>
            <div className="space-y-4">
                <div>
                    <label htmlFor="firstName" className="block text-right font-medium">שם פרטי</label>
                    <input
                        id="firstName"
                        {...register("firstName")}
                        className="w-full border border-gray-300 p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 "
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
                    <label htmlFor="gender" className="block text-right font-medium">מין</label>
                    <select
                        id="gender"
                        {...register("gender")}
                        className="w-full border border-gray-300 p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                    >
                        <option value="">בחר מין</option>
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

                <Button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 font-bold py-3 px-6 rounded-lg"

                >
                    🤗 סיימתי
                </Button>
            </div>
        </form>


    );
};

export default EditUserForm;
