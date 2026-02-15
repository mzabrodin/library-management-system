import {LoanStatus} from "../schemas/loan.schema";

export interface Identifiable {
    id: string
}

export type Book = Identifiable & {
    title: string,
    author: string,
    year: number,
    isbn: string,
    available: boolean
};

export type User = Identifiable & {
    name: string,
    email: string
};

export type Loan = Identifiable & {
    userId: string,
    bookId: string,
    loanDate: Date,
    returnDate: Date | null,
    status: LoanStatus
};