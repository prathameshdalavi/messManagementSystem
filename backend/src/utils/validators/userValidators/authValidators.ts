import { z } from "zod";
export const validateUserSignup = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6).max(30),
    phone: z.number().min(10),
    hostelAddress: z.string().min(5).max(100),
}).parse
export const validateUserSignin = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(30)
}).parse