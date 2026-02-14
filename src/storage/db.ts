import {Book, Loan, User} from "../types";

export const db = {
    books: Map<string, Book>,
    users: Map<string, User>,
    loans: Map<string, Loan>,
}