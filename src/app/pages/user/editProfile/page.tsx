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
                politicalAffiliation: PoliticalAffiliation.HardRight,
                religionLevel: ReligionLevel.Other,
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
                setValue("profileImage", imageUrl); // שמור את ה-URL של התמונה בטופס
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

                alert("User updated successfully!\n" + data);
            }
            else {
                alert("no user to update")
            }
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user");
        }
    };



    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 space-y-4">
            <div className="flex items-center space-x-4 mb-6">
                <ProfileImage url={user?.profileImage} firstName={user?.firstName}  size="large"  />
                <div>
                    <h2 className="text-lg font-bold">שלום, {user?.firstName}</h2>
                    <p className="text-sm text-gray-600">ערוך את פרטי החשבון שלך כאן</p>
                </div>
            </div>
            
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
                <FieldsInputList fields={fields} setFields={setFields} />
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

            <Button type="submit" className="w-full"
            >
                Save Changes
            </Button>
        </form>
    );
};

export default EditUserForm;
