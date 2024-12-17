'use client'
import React, { useEffect } from "react";
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

// import FieldsInputList from "@/app/components/FieldsInputList";

const SignupForm = () => {

    const router = useRouter();
    const storeUser = useUserStore((st) => st.user);

    const setUser = useUserStore((state) => state.setUser);
    const [fields, setFields] = React.useState<IField[]>([{ mainField: "", subField: "" }]);

    const { register, setValue, handleSubmit, formState: { errors } } = useForm
        <SignupFormData>
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

    const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
        console.log("data on submit", data);
        console.log("Submitted data:", data.fields);


        try {
            const userData = await signupUser(data);
            console.log("user data on submit", userData);

            if (userData)
                console.log('User signed up successfully:', userData);
            const user = (userData as { user: IUser }).user;
            console.log("user before store",user);
            
            setUser(user);
   
            console.log("user after store",storeUser);

            router.push('/')
            console.log("user", user);

        } catch (error) {
            console.error('Error signing up:', error);
        }

    };

    return (
        <div>

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
 