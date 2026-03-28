import express from "express";
import {validate} from "../middleware/validate.middleware";
import {loginSchema, refreshSchema, registerSchema} from "../schemas/user.schema";
import * as AuthController from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", validate(registerSchema), AuthController.register);

router.post("/login", validate(loginSchema), AuthController.login);

router.post("/refresh", validate(refreshSchema), AuthController.refresh);

export default router;