import validate from "@/middleware/validator.middleware";

import { login, register } from "@/controllers/auth.controllers";
import {
  login as loginSchema,
  register as registerSchema,
} from "@/validator/auth.validator";
import { Router } from "express";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);

export default router;
