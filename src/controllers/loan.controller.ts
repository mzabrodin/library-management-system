import {Request, Response} from 'express';
import {LoanDto} from "../schemas/loan.schema";
import {loanService} from "../services/loan.service";
import {userService} from "../services/user.service";
import {bookService} from "../services/book.service";

type LoanParams = {
    id: string;
}

export function getAllLoans(_: Request, res: Response) {
    res.status(200).json(loanService.findAll());
}

export function lendBook(req: Request<{}, {}, LoanDto>, res: Response) {
    const user = userService.findById(req.body.userId);
    if (!user) {
        return res.status(404).json({error: "User not found"});
    }

    const book = bookService.findById(req.body.bookId);
    if (!book) {
        return res.status(404).json({error: "Book not found"});
    }

    if (!book.available) {
        if (loanService.existsActiveLoanForBook(book.id)) {
            return res.status(400).json({error: "Book is not available for lending"});
        }

        console.warn(`Book '${book.title}' is unavailable without active loans`);
    }

    const loan = loanService.loan(req.body, user, book);
    bookService.changeAvailability(book, false);

    res.status(201).json(loan);
}

export function returnBook(req: Request<LoanParams>, res: Response) {
    const loan = loanService.findById(req.params.id);
    if (!loan) {
        return res.status(404).json({error: "Loan not found"});
    }

    if (loan.status === "RETURNED") {
        return res.status(400).json({error: "Book has already been returned"});
    }

    const book = bookService.findById(loan.bookId);
    if (!book) {
        return res.status(404).json({error: "Book not found"});
    }

    const updatedLoan = loanService.return(loan);
    bookService.changeAvailability(book, true);

    res.status(200).json(updatedLoan);
}