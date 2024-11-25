import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormData, signupSchema } from "@/app/zod/signInSchema";
import { Gender } from "@/app/types/enums/gender";

const SignupForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit: SubmitHandler<SignupFormData> = (data) => {
        console.log(data);
        alert("Form submitted successfully!");
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
                <label className="block font-medium">Fields</label>
                <input
                    {...register("fields.0.name")}
                    placeholder="Field Name"
                    className="w-full border border-gray-300 p-2 rounded mb-2"
                />
                <input
                    {...register("fields.0.level")}
                    placeholder="Field Level"
                    className="w-full border border-gray-300 p-2 rounded"
                />
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

            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
                Submit
            </button>
        </form>
    );
};

export default SignupForm;
