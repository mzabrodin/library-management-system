import * as z from 'zod';

export const UserSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, {error: "Name is required"})
        .max(100, {error: "Name must be less than 100 characters"}),

    email: z.email({error: "Invalid email address"})
});

export type UserDto = z.infer<typeof UserSchema>;