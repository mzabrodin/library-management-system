import {Request, Response} from 'express';
import {CreateBookDto, UpdateBookDto} from "../schemas/book.schema";
import {bookService} from "../services/book.service";

type BookParams = {
    id: string;
}

export async function getAllBooks(_: Request, res: Response) {
    const books = await bookService.findAll();
    res.status(200).json(books);
}

export async function getBookById(req: Request<BookParams>, res: Response) {
    const book = await bookService.findById(req.params.id);
    if (book == null) {
        return res.status(404).json({error: "Book not found"});
    }

    res.status(200).json(book);
}

export async function createBook(req: Request<{}, {}, CreateBookDto>, res: Response) {
    const existsByIsbn = await bookService.existsByIsbn(req.body.isbn);
    if (existsByIsbn) {
        return res.status(400).json({error: "Book with this ISBN already exists"});
    }

    const book = await bookService.create(req.body);
    res.status(201).json(book);
}

export async function updateBook(req: Request<BookParams, {}, UpdateBookDto>, res: Response) {
    const existsById = await bookService.existsById(req.params.id);
    if (!existsById) {
        return res.status(404).json({error: "Book not found"});
    }

    if (req.body.isbn) {
        const bookWithIsbn = await bookService.findByIsbn(req.body.isbn);

        if (bookWithIsbn && bookWithIsbn.id !== req.params.id) {
            return res.status(400).json({error: "Book with this ISBN already exists"});
        }
    }

    const updatedBook = await bookService.update(req.params.id, req.body);
    res.status(200).json(updatedBook);

}

export async function deleteBook(req: Request<BookParams>, res: Response) {
    const exists = await bookService.existsById(req.params.id);
    if (!exists) {
        return res.status(404).json({error: "Book not found"});
    }

    await bookService.delete(req.params.id);
    res.status(204).send();

}