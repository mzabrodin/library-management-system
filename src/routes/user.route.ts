import express from "express";
import {validate} from "../middleware/validate";
import{userSchema} from "../schemas/user.schema";
import * as UserController from "../controllers/user.controller";

const router = express.Router();

router.get("/", UserController.getAllUsers);

router.get("/:id", UserController.getUserById);

router.post("/", validate(userSchema), UserController.createUser);

export default router;