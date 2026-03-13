import express from "express";
import {validate} from "../middleware/validate.middleware";
import {LoanSchema} from "../schemas/loan.schema";
import * as LoanController from "../controllers/loan.controller";
import {authenticateJWT, requireAdmin} from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", authenticateJWT, LoanController.getAllLoans);

router.post("/", authenticateJWT, validate(LoanSchema), LoanController.lendBook);

router.post("/:id/return", authenticateJWT, LoanController.returnBook);

export default router;