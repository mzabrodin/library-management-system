import {Request, Response} from 'express';
import {LoanDto} from "../schemas/loan.schema";
import {loanService} from "../services/loan.service";
import {bookService} from "../services/book.service";
import {LoanStatus} from "../generated/prisma/enums";

type LoanParams = {
    id: string;
}

export async function getAllLoans(_: Request, res: Response) {
    const loans = await loanService.findAll();
    res.status(200).json(loans);
}

export async function lendBook(req: Request<{}, {}, LoanDto>, res: Response) {
    const userId = req.user!.id;

    const book = await bookService.findById(req.body.bookId);
    if (book == null) {
        return res.status(404).json({error: "Book not found"});
    }

    if (!book.available) {
        const hasActiveLoan = await loanService.existsActiveLoanForBook(book.id);
        if (hasActiveLoan) {
            return res.status(400).json({error: "Book is not available for lending"});
        }

        console.warn(`Book '${book.title}' is unavailable without active loans`);
    }

    const loan = await loanService.loan(userId, req.body.bookId, req.body.loanDate);
    res.status(201).json(loan);
}

export async function returnBook(req: Request<LoanParams>, res: Response) {
    const loan = await loanService.findById(req.params.id);
    if (loan == null) {
        return res.status(404).json({error: "Loan not found"});
    }

    if (loan.status === LoanStatus.RETURNED) {
        return res.status(400).json({error: "Book has already been returned"});
    }

    const updatedLoan = await loanService.return(loan.id, loan.bookId);
    res.status(200).json(updatedLoan);
}