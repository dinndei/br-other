import { z } from 'zod';
import { Gender } from '../types/enums/gender';
import { PoliticalAffiliation } from '../types/enums/politicalAffiliation';
import { ReligionLevel } from '../types/enums/ReligionLevel';
import { fieldSchema } from './fieldSchema';


export const signupSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    userName: z.string().min(3, "Username must be at least 3 characters"),
    age: z.number().min(13, "You must be at least 13 years old"),
    email: z.string().email("Invalid email address"),
    gender: z.nativeEnum(Gender),
    fields: z.array(fieldSchema).min(1, "At least one field is required"),
    typeUser: z.object({
        religionLevel: z.nativeEnum(ReligionLevel),
        politicalAffiliation: z.nativeEnum(PoliticalAffiliation),
    }),
});

export type EditProfFormData = z.infer<typeof signupSchema>;
