import {Book, Loan, User} from "../types";
import {JsonStorage} from "./json-storage";

export const db = {
    books: new JsonStorage<Book>('books'),
    users: new JsonStorage<User>('users'),
    loans: new JsonStorage<Loan>('loans'),
};