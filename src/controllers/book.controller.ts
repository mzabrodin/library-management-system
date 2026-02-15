import {Request, Response} from 'express';
import {db} from "../storage/db";
import {CreateBookDto, UpdateBookDto} from "../schemas/book.schema";
import {Book} from "../types";

type BookParams = {
    id: string;
}

export function getAllBooks(req: Request, res: Response) {
    const books = Array.from(db.books.values());
    res.status(200).json(books);
}

export function getBookById(req: Request<BookParams>, res: Response) {
    const id = req.params.id;
    const book = db.books.get(id);

    if (!book) {
        return res.status(404).json({error: "Book not found"});
    }

    res.status(200).json(book);
}

export function createBook(req: Request<{}, {}, CreateBookDto>, res: Response) {
    const {title, author, year, isbn, available} = req.body;

    const isbnExists = Array.from(db.books.values()).some(book => book.isbn === isbn);
    if (isbnExists) {
        return res.status(400).json({error: "Book with this ISBN already exists"});
    }

    const id = crypto.randomUUID();
    const book: Book = {
        id,
        title,
        author,
        year,
        isbn,
        available
    }

    db.books.set(id, book);

    res.status(201).json(book);
}

export function updateBook(req: Request<BookParams, {}, UpdateBookDto>, res: Response) {
    const id = req.params.id;
    const isbn = req.body.isbn;
    const book = db.books.get(id);

    if (!book) {
        return res.status(404).json({error: "Book not found"});
    }

    if (isbn && isbn !== book.isbn) {
        const isbnExists = Array.from(db.books.values()).some(b => b.isbn === isbn);
        if (isbnExists) {
            return res.status(400).json({error: "Book with this ISBN already exists"});
        }
    }

    const updatedBook: Book = {
        ...book,
        ...req.body,
    };

    db.books.set(id, updatedBook);

    res.status(200).json(updatedBook);
}

export function deleteBook(req: Request<BookParams>, res: Response) {
    const id = req.params.id;
    db.books.delete(id);
    res.status(204).send();
}