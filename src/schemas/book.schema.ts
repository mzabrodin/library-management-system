import * as z from 'zod';

// Regular Expressions to Validate ISBN Code from https://www.geeksforgeeks.org/dsa/regular-expressions-to-validate-isbn-code/
const isbnRegex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[0-9-]+$/;

export const createBookSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, {error: "Title is required"})
        .max(100, {error: "Title must be less than 100 characters"}),

    author: z
        .string()
        .trim()
        .min(1, {error: "Author is required"})
        .max(100, {error: "Author must be less than 100 characters"}),

    year: z
        .number()
        .int({error: "Year must be an integer"})
        .positive({error: "Year must be a positive integer"})
        .max(new Date().getFullYear(), {error: "Year cannot be in the future"}),

    isbn: z
        .string()
        .trim()
        .min(1, {error: "ISBN is required"})
        .regex(isbnRegex, {error: "ISBN must be a valid format, digits and hyphens only"}),

    available: z.boolean()
});

export const updateBookSchema = createBookSchema.partial();

export type CreateBookDto = z.infer<typeof createBookSchema>;
export type UpdateBookDto = z.infer<typeof updateBookSchema>;