import {prisma} from "../db/prisma";
import {Loan, LoanStatus} from "../generated/prisma/client";

export class LoanService {
    async findAll(): Promise<Loan[]> {
        return prisma.loan.findMany();
    }

    async findByUserId(userId: string): Promise<Loan[]> {
        return prisma.loan.findMany({
            where: { userId }
        });
    }

    async findById(id: string): Promise<Loan | null> {
        return prisma.loan.findUnique({where: {id}})
    }

    async existsActiveLoanForBook(bookId: string): Promise<boolean> {
        const count = await prisma.loan.count({where: {bookId: bookId, status: LoanStatus.ACTIVE}});
        return count > 0;
    }

    async loan(userId: string, bookId: string, loadDate: Date): Promise<Loan> {
        return prisma.$transaction(async (transaction) => {
            const newLoan = await transaction.loan.create({
                data: {
                    userId: userId,
                    bookId: bookId,
                    loanDate: loadDate || new Date(),
                    status: LoanStatus.ACTIVE
                }
            });

            await transaction.book.update({where: {id: bookId}, data: {available: false}});
            return newLoan;
        });
    }

    async return(loanId: string, bookId: string): Promise<Loan> {
        return prisma.$transaction(async (transaction) => {
            const updatedLoan = await transaction.loan.update({
                where: {id: loanId},
                data: {returnDate: new Date(), status: LoanStatus.RETURNED}
            });

            await transaction.book.update({where: {id: bookId}, data: {available: true}});
            return updatedLoan;
        });
    }
}

export const loanService = new LoanService();