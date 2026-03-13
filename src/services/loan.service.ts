import {Book, Loan, User} from "../types";
import {LoanDto} from "../schemas/loan.schema";
import {prisma} from "../db/prisma";

export class LoanService {
    async findAll(): Promise<Loan[]> {
        return prisma.loan.findMany();
    }

    async findById(id: string): Promise<Loan | null> {
        return prisma.loan.findUnique({
            where: {id}
        })
    }

    async existsActiveLoanForBook(bookId: string): Promise<boolean> {
        const activeLoan = await prisma.loan.findFirst({
            where: {
                bookId: bookId,
                status: "ACTIVE"
            }
        });
        return activeLoan !== null;
    }

    async loan(dto: LoanDto): Promise<Loan> {
        return prisma.$transaction(async (tx) => {
            const newLoan = await tx.loan.create({
                data: {
                    userId: dto.userId,
                    bookId: dto.bookId,
                    loanDate: dto.loanDate || new Date(),
                    status: "ACTIVE"
                }
            });

            await tx.book.update({
                where: {id: dto.bookId},
                data: {available: false}
            });

            return newLoan;
        });
    }

    async return(loanId: string): Promise<Loan> {
        return prisma.$transaction(async (transaction) => {
            const currentLoan = await transaction.loan.findUnique({
                where: {id: loanId}
            });

            if (!currentLoan) throw new Error("Loan not found");

            const updatedLoan = await transaction.loan.update({
                where: {id: loanId},
                data: {
                    returnDate: new Date(),
                    status: "RETURNED"
                }
            });

            await transaction.book.update({
                where: {id: currentLoan.bookId},
                data: {available: true}
            });

            return updatedLoan;
        });
    }
}

export const loanService = new LoanService();