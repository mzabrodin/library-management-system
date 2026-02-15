import express from "express";
import {validate} from "../middleware/validate";
import {createBookSchema, updateBookSchema} from "../schemas/book.schema";
import * as BookController from "../controllers/book.controller";

const router = express.Router();

router.get("/", BookController.getAllBooks);

router.get("/:id", BookController.getBookById);

router.post("/", validate(createBookSchema), BookController.createBook);

router.put("/:id", validate(updateBookSchema), BookController.updateBook);

router.delete("/:id", BookController.deleteBook);

export default router;