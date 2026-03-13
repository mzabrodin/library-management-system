import {CreateBookDto, UpdateBookDto} from "../schemas/book.schema";
import {prisma} from "../db/prisma";
import {Book} from "../generated/prisma/client";

export class BookService {
    async findAll(): Promise<Book[]> {
        return prisma.book.findMany();
    }

    async findById(id: string): Promise<Book | null> {
        return prisma.book.findUnique({where: {id}});
    }

    async existsById(id: string): Promise<boolean> {
        const count = await prisma.book.count({where: {id}});
        return count > 0;
    }

    async existsByIsbn(isbn: string): Promise<boolean> {
        const count = await prisma.book.count({where: {isbn}});
        return count > 0;
    }

    async create(dto: CreateBookDto): Promise<Book> {
        return prisma.book.create({
            data: {
                title: dto.title,
                author: dto.author,
                year: dto.year,
                isbn: dto.isbn,
                available: dto.available
            }
        });
    }

    async update(id: string, dto: UpdateBookDto): Promise<Book> {
        return prisma.book.update({where: {id}, data: dto});
    }

    async delete(id: string): Promise<Book> {
        return prisma.book.delete({where: {id}});
    }
}

export const bookService = new BookService();