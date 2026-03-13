import * as z from 'zod';

// Regular Expressions to Validate password from https://stackoverflow.com/a/21456918
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const userRoleSchema = z.enum(["USER", "ADMIN"], {error: "Role must be either 'USER' or 'ADMIN'"});

export const userSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, {error: "Name is required"})
        .max(100, {error: "Name must be less than 100 characters"}),

    email: z.email({error: "Invalid email address"}),

    password: z
        .string()
        .min(8, {error: "Password must be at least 8 characters"})
        .max(100, {error: "Password must be less than 100 characters"})
        .regex(passwordRegex, {error:"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"}),

    role: userRoleSchema.default("USER")
});

export type UserDto = z.infer<typeof userSchema>;
export type UserRole = z.infer<typeof userRoleSchema>;