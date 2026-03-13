import express from "express";
import * as UserController from "../controllers/user.controller";
import {authenticateJWT, requireAdmin} from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", authenticateJWT, requireAdmin, UserController.getAllUsers);

router.get("/me", authenticateJWT, UserController.getCurrentUser);

router.get("/:id", authenticateJWT, requireAdmin, UserController.getUserById);

export default router;