import {Request, Response} from 'express';
import {db} from "../storage/db";
import {LoanDto} from "../schemas/loan.schema";
import {Loan} from "../types";

type LoanParams = {
    id: string;
}

export function getAllLoans(req: Request, res: Response) {
    const loans = Array.from(db.loans.values());
    res.status(200).json(loans);
}

export function lendBook(req: Request<{}, {}, LoanDto>, res: Response) {
    const {userId, bookId, loanDate} = req.body;

    const user = db.users.get(userId);
    if (!user) {
        return res.status(404).json({error: "User not found"});
    }

    const book = db.books.get(bookId);
    if (!book) {
        return res.status(404).json({error: "Book not found"});
    }

    if (!book.available) {
        const hasActiveLoan = Array.from(db.loans.values())
            .some(loan => loan.bookId === bookId && loan.status === "ACTIVE");

        if (hasActiveLoan) {
            return res.status(400).json({error: "Book is not available for lending"});
        }

        console.warn(`Book '${book.title}' is unavailable without active loans`);
    }

    const id = crypto.randomUUID();
    const loan: Loan = {
        id,
        userId,
        bookId,
        loanDate: loanDate || new Date(),
        returnDate: null,
        status: "ACTIVE"
    }

    db.loans.set(id, loan);
    book.available = false;
    db.books.set(bookId, book);

    res.status(201).json(loan);
}

export function returnBook(req: Request<LoanParams>, res: Response) {
    const id = req.params.id;
    const loan = db.loans.get(id);

    if (!loan) {
        return res.status(404).json({error: "Loan not found"});
    }

    if (loan.status === "RETURNED") {
        return res.status(400).json({error: "Book has already been returned"});
    }

    const book = db.books.get(loan.bookId);
    if (!book) {
        return res.status(404).json({error: "Book not found"});
    }

    loan.status = "RETURNED";
    loan.returnDate = new Date();
    db.loans.set(id, loan);

    book.available = true;
    db.books.set(book.id, book);

    res.status(200).json(loan);
}