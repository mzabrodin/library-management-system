import express from "express";
import userRoutes from "./user.route";
import bookRoute from "./book.route";
import loanRoute from "./loan.route";

const router = express.Router();

router.use("/books", bookRoute)
router.use("/users", userRoutes);
router.use("/loans", loanRoute);

export default router;