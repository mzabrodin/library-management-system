import express from "express";
import {validate} from "../middleware/validate.middleware";
import {registerSchema} from "../schemas/user.schema";
import * as UserController from "../controllers/user.controller";
import {authenticateJWT, requireAdmin} from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", authenticateJWT, requireAdmin, UserController.getAllUsers);

router.get("/:id", authenticateJWT, requireAdmin, UserController.getUserById);

router.get("/me", authenticateJWT, validate(registerSchema), UserController.getCurrentUser);

export default router;