'use client'
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormData } from "@/app/zod/signInSchema";
import { useUserStore } from "@/app/store/userStore";
import { editUser } from "@/app/actions/userActions";
import Button from "@/app/components/Button";
import { ReligionLevel } from "@/app/types/enums/ReligionLevel";
import { PoliticalAffiliation } from "@/app/types/enums/politicalAffiliation";
import { Gender } from "@/app/types/enums/gender";
import FieldsInputList from "@/app/components/FieldsInputList";
//import IField from "@/app/types/IField";
import { EditProfFormData, editProfSchema } from "@/app/zod/editProfSchema";
import IFieldToDB from "@/app/types/IFieldToDB";
import axios from "axios";

const EditUserForm = () => {
    const user = useUserStore((st) => st.user);
    //const [fields, setFields] = useState<IField[] | undefined>(user?.fields);
    const [fieldsData, setFieldsData] = useState<IFieldToDB[]>([]);
    const [selectedMainField, setSelectedMainField] = useState<string>("");

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<EditProfFormData>({
        resolver: zodResolver(editProfSchema),
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            userName: user?.userName || "",
            age: user?.age || 0,
            email: user?.email || "",
            gender: user?.gender || Gender.Other,
            fields: user?.fields || [{ mainField: "", subField: "" }],
            typeUser: user?.typeUser || {
                politicalAffiliation: PoliticalAffiliation.HardRight,
                religionLevel: ReligionLevel.Other,
            }
        },
    });

    useEffect(() => {
        const fetchFields = async () => {
            try {
                const response = await axios.post('/api/fields/getAllFields');
                if (response.data.success) {
                    setFieldsData(response.data.fields);
                }
            } catch (error) {
                console.error('Failed to fetch fields:', error);
            }
        };
        fetchFields();
    }, []);



    const onSubmit: SubmitHandler<EditProfFormData> = async (data) => {
        try {
            if (user) {
                const updatedUser = await editUser(String(user._id), data);
                if (updatedUser)
                    console.log("user ypdated", updatedUser);

                // setUser(updatedUser);
            }
            alert("User updated successfully!\n" + data);

        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user");
        }
    };

    const handleMainFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedField = e.target.value;
        setSelectedMainField(selectedField);
        setValue("fields.0.mainField", selectedField); // Set the main field value directly
        setValue("fields.0.subField", "");

    };



    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 space-y-4">
            <h1>טופס עריכת פרטי משתמש</h1>
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
            {/* <div>
                <FieldsInputList fields={fields}
                    setFields={(newFields) => {
                        setFields(newFields);
                        setValue("fields", fields);

                    }}
                />
                {errors.fields && <p className="text-red-500">{errors.fields.message}</p>}

            </div> */}
            <div>
                <label htmlFor="mainField" className="block font-medium">Main Field</label>
                <select
                    id="mainField"
                    {...register("fields.0.mainField")}
                    className="w-full border border-gray-300 p-2 rounded"
                    onChange={handleMainFieldChange}
                >
                    <option value="">Select Main Field</option>
                    {fieldsData.map((field) => (
                        <option key={field.mainField} value={field.mainField}>
                            {field.mainField}
                        </option>
                    ))}
                </select>
                {errors.fields?.[0]?.mainField && <p className="text-red-500">{errors.fields[0].mainField.message}</p>}
            </div>

            {/* Sub Field */}
            <div>
                <label htmlFor="subField" className="block font-medium">Sub Field</label>
                <select
                    id="subField"
                    {...register("fields.0.subField")}
                    className="w-full border border-gray-300 p-2 rounded"
                >
                    <option value="">Select Sub Field</option>
                    {fieldsData
                        .filter((field) => field.mainField === selectedMainField)
                        .flatMap((field) =>
                            field.subFields.map((sub) => (
                                <option key={sub} value={sub}>
                                    {sub}
                                </option>
                            ))
                        )}
                </select>
                {errors.fields?.[0]?.subField && <p className="text-red-500">{errors.fields[0].subField.message}</p>}
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
