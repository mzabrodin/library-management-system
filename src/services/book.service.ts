import {db} from "../storage/db";
import {Book} from "../types";
import {CreateBookDto, UpdateBookDto} from "../schemas/book.schema";

export class BookService {
    findAll(): Book[] {
        return db.books.getAll();
    }

    findById(id: string): Book | undefined {
        return db.books.getById(id);
    }

    existsById(id: string): boolean {
        return db.books.getById(id) !== undefined;
    }

    existsByIsbn(isbn: string): boolean {
        return db.books.getAll().some(book => book.isbn === isbn);
    }

    changeAvailability(book: Book, available: boolean): Book {
        const updatedBook: Book = {
            ...book,
            available: available
        }

        db.books.saveToMap(updatedBook);
        db.books.saveToFile();

        return updatedBook;
    }

    create(dto: CreateBookDto): Book {
        const id = crypto.randomUUID();
        const book: Book = {
            id,
            title: dto.title,
            author: dto.author,
            year: dto.year,
            isbn: dto.isbn,
            available: dto.available
        }

        db.books.saveToMap(book);
        db.books.saveToFile();

        return book;
    }

    update(id: string, dto: UpdateBookDto): Book {
        const book = db.books.getById(id)!;

        const updatedBook: Book = {
            ...book,
            ...dto
        }

        db.books.saveToMap(updatedBook);
        db.books.saveToFile();

        return updatedBook;
    }

    delete(id: string) {
        const result = db.books.deleteFromMap(id);
        db.books.saveToFile();

        return result;
    }

}

export const bookService = new BookService();