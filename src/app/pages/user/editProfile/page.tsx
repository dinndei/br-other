'use client';
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormData } from "@/app/zod/signInSchema";
import { useUserStore } from "@/app/store/userStore";
import { editUser } from "@/app/actions/userActions";
import Button from "@/app/components/Button";

const EditUserForm = () => {
    const { user, setUser } = useUserStore((state) => ({
        user: state.user,
        setUser: state.setUser,
    }));

    const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: user || {
            firstName: "",
            lastName: "",
            userName: "",
            age: 0,
            email: "",
            password: "",
            gender: "male", // או ערך ברירת מחדל מתאים
            fields: [{ mainField: "", subField: "" }],
            typeUser: { type: "", description: "" },
        },
    });

    const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
        try {
            const updatedUser = await editUser(user?._id!, data);
            setUser(updatedUser);
            alert("User updated successfully!");
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user");
        }
    };

    return (
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
            {/* Add other fields as in SignupForm */}
            <Button type="submit" className="w-full">
                Save Changes
            </Button>
        </form>
    );
};

export default EditUserForm;
