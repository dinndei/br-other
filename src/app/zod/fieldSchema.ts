import { z } from 'zod';

// Define Zod schema for IField
export const fieldSchema = z.object({
    mainField: z.string().min(1, "Field name is required"),
    subFields: z.string().optional(), // Example property, adjust based on your IField type
});