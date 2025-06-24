import { z } from 'zod';
export const validateMenu = z.object({
    menu: z.array(z.object({
    day: z.string(),
    meals: z.object({
      breakfast: z.array(z.string()),
      lunch: z.array(z.string()),
      dinner: z.array(z.string()),
      snacks: z.array(z.string())
    })
}))
}).parse;