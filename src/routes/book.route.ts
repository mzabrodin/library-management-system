import express from "express";
import {validate} from "../middleware/validate.middleware";
import {createBookSchema, updateBookSchema} from "../schemas/book.schema";
import * as BookController from "../controllers/book.controller";
import {authenticateJWT, requireAdmin} from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", BookController.getAllBooks);

router.get("/:id", BookController.getBookById);

router.post("/", authenticateJWT, requireAdmin, validate(createBookSchema), BookController.createBook);

router.put("/:id", authenticateJWT, requireAdmin, validate(updateBookSchema), BookController.updateBook);

router.delete("/:id", authenticateJWT, requireAdmin, BookController.deleteBook);

export default router;