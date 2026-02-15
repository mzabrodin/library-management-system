import {db} from "../storage/db";
import {Book, Loan, User} from "../types";
import {LoanDto} from "../schemas/loan.schema";

export class LoanService {
    findAll(): Loan[] {
        return db.loans.getAll();
    }

    findById(id: string): Loan | undefined {
        return db.loans.getById(id);
    }

    existsActiveLoanForBook(bookId: string): boolean {
        return this.findAll().some(loan => loan.bookId === bookId && loan.status === "ACTIVE");
    }

    loan(dto: LoanDto, user: User, book: Book): Loan {
        const id = crypto.randomUUID();
        const loan: Loan = {
            id,
            userId: user.id,
            bookId: book.id,
            loanDate: dto.loanDate || new Date(),
            returnDate: dto.returnDate || null,
            status: dto.status || "ACTIVE"
        }

        db.loans.saveToMap(loan);
        db.loans.saveToFile();

        return loan;
    }

    return(dto: LoanDto, loan: Loan): Loan {
        const updatedLoan: Loan = {
            ...loan,
            returnDate: dto.returnDate || new Date(),
            status: dto.status || "RETURNED"
        }

        db.loans.saveToMap(updatedLoan);
        db.loans.saveToFile();

        return updatedLoan;
    }
}

export const loanService = new LoanService();