import {z} from 'zod';
export const validatePlan = z.object({
    name:z.string(),
    description:z.string(),
    amount:z.number().positive(),
    durationDays:z.number().int().positive(),
    features:z.array(z.string())
}).parse;
