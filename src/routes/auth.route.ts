import express from "express";
import {validate} from "../middleware/validate.middleware";
import {loginSchema, registerSchema} from "../schemas/user.schema";
import * as AuthController from "../controllers/auth.controller";
import {authenticateJWT} from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register", validate(registerSchema), AuthController.register);

router.post("/login", validate(loginSchema), AuthController.login);

router.post("/refresh", authenticateJWT, AuthController.refresh);

export default router;