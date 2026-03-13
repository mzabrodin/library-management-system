import * as z from 'zod';

export const loanStatusSchema = z
    .enum(["ACTIVE", "RETURNED"], {error: "Status must be either 'ACTIVE' or 'RETURNED'"});

export const LoanSchema = z.object({
    userId: z.uuid({error: "User ID must be a valid UUID"}).optional(),

    bookId: z.uuid({error: "Book ID must be a valid UUID"}),

    loanDate: z
        .coerce
        .date({error: "Loan date must be a valid date"})
        .max(new Date(), {error: "Loan date cannot be in the future"})
        .default(() => new Date()),

    returnDate: z
        .coerce
        .date({error: "Return date must be a valid date"})
        .max(new Date(), {error: "Return date cannot be in the future"})
        .nullable()
        .optional(),

    status: loanStatusSchema.default("ACTIVE")
}).refine((data) => {
    if (!data.returnDate) {
        return true;
    }

    return data.returnDate >= data.loanDate;
}, {
    error: "Return date cannot be before loan date",
    path: ["returnDate"]
});

export type LoanDto = z.infer<typeof LoanSchema>;