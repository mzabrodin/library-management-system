import {Request, Response} from 'express';
import {LoanDto} from "../schemas/loan.schema";
import {loanService} from "../services/loan.service";
import {bookService} from "../services/book.service";
import {LoanStatus, UserRole} from "../generated/prisma/enums";
import {userService} from "../services/user.service";

type LoanParams = {
    id: string;
}

export async function getAllLoans(req: Request, res: Response) {
    const user = req.user!;
    let loans;

    if (user.role === UserRole.ADMIN) {
        loans = await loanService.findAll();
    } else {
        loans = await loanService.findByUserId(user.id);
    }

    res.status(200).json(loans);
}

export async function lendBook(req: Request<{}, {}, LoanDto>, res: Response) {
    let targetUserId = req.body.userId || req.user!.id;

    if (req.body.userId && req.body.userId !== req.user!.id && req.user!.role !== "ADMIN") {
        return res.status(403).json({ error: "You cannot lend a book to another user" });
    }

    if (targetUserId !== req.user!.id) {
        const targetUser = await userService.findById(targetUserId);
        if (targetUser == null) {
            return res.status(404).json({ error: "Target user not found" });
        }
    }

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

    const loan = await loanService.loan(targetUserId, req.body.bookId, req.body.loanDate);
    res.status(201).json(loan);
}

export async function returnBook(req: Request<LoanParams>, res: Response) {
    const loan = await loanService.findById(req.params.id);
    if (loan == null) {
        return res.status(404).json({error: "Loan not found"});
    }

    if (loan.userId !== req.user!.id && req.user!.role !== UserRole.ADMIN) {
        return res.status(403).json({error: "You cannot return a book that belongs to someone else"});
    }

    if (loan.status === LoanStatus.RETURNED) {
        return res.status(400).json({error: "Book has already been returned"});
    }

    const updatedLoan = await loanService.return(loan.id, loan.bookId);
    res.status(200).json(updatedLoan);
}