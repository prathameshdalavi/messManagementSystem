import { z } from "zod";
export const validateMessAdminSignup = z.object({
    messName: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6).max(30),
    phone: z.number().min(10),
    messLocation: z.string().min(5).max(100),
    capacity: z.number().min(10),
    location: z.object({
        latitude: z.number(),
        longitude: z.number(),
    })
}).parse
export const validateMessAdminSignin = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(30)
}).parse
