import express from "express";
import {validate} from "../middleware/validate";
import {LoanSchema} from "../schemas/loan.schema";
import * as LoanController from "../controllers/loan.controller";

const router = express.Router();

router.get("/", LoanController.getAllLoans);

router.post("/", validate(LoanSchema), LoanController.lendBook);

router.post("/:id/return", LoanController.returnBook);

export default router;