import {Book, Loan, User} from "../types";

export const db = {
    books: new Map<string, Book>(),
    users: new Map<string, User>(),
    loans: new Map<string, Loan>(),
}