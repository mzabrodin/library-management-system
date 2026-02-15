import {Request, Response} from 'express';
import {CreateBookDto, UpdateBookDto} from "../schemas/book.schema";
import {bookService} from "../services/book.service";

type BookParams = {
    id: string;
}

export function getAllBooks(_: Request, res: Response) {
    res.status(200).json(bookService.findAll());
}

export function getBookById(req: Request<BookParams>, res: Response) {
    const book = bookService.findById(req.params.id);

    if (!book) {
        return res.status(404).json({error: "Book not found"});
    }

    res.status(200).json(book);
}

export function createBook(req: Request<{}, {}, CreateBookDto>, res: Response) {
    if (bookService.existsByIsbn(req.body.isbn)) {
        return res.status(400).json({error: "Book with this ISBN already exists"});
    }

    const book = bookService.create(req.body)
    res.status(201).json(book);
}

export function updateBook(req: Request<BookParams, {}, UpdateBookDto>, res: Response) {
    if (!bookService.existsById(req.params.id)) {
        return res.status(404).json({error: "Book not found"});
    }

    if (req.body.isbn && bookService.existsByIsbn(req.body.isbn)) {
        return res.status(400).json({error: "Book with this ISBN already exists"});
    }

    const updatedBook = bookService.update(req.params.id, req.body);
    res.status(200).json(updatedBook);
}

export function deleteBook(req: Request<BookParams>, res: Response) {
    bookService.delete(req.params.id)
    res.status(204).send();
}