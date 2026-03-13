import {Book} from "../types";
import {CreateBookDto, UpdateBookDto} from "../schemas/book.schema";
import {prisma} from "../storage/db";

export class BookService {
    async findAll(): Promise<Book[]> {
        return prisma.book.findMany();
    }

    async findById(id: string): Promise<Book | null> {
        return prisma.book.findUnique({
            where: {id}
        });
    }

    async existsById(id: string): Promise<boolean> {
        const count = await prisma.book.count({
            where: {id}
        });
        return count > 0;
    }

    async existsByIsbn(isbn: string): Promise<boolean> {
        const book = await prisma.book.findUnique({
            where: {isbn}
        });
        return book !== null;
    }

    async changeAvailability(id: string, available: boolean): Promise<Book> {
        return prisma.book.update({
            where: {id},
            data: {available}
        });
    }

    async create(dto: CreateBookDto): Promise<Book> {
        return prisma.book.create({
            data: {
                title: dto.title,
                author: dto.author,
                year: dto.year,
                isbn: dto.isbn,
                available: dto.available ?? true
            }
        });
    }

    async update(id: string, dto: UpdateBookDto): Promise<Book> {
        return prisma.book.update({
            where: {id},
            data: dto
        });
    }

    async delete(id: string): Promise<Book> {
        return prisma.book.delete({
            where: {id}
        });
    }
}

export const bookService = new BookService();