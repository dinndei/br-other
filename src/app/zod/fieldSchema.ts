import { z } from 'zod';

export const fieldSchema = z.object({
    mainField: z.string().min(1, "Field name is required"),
    subField: z.string()
});