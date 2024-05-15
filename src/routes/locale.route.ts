import authenticated from "@/middleware/authenticated.middleware";
import { getLocale, updateLocale } from "@/controllers/locale.controllers";
import { Router } from "express";

const router = Router();

router.get("/", getLocale);
router.put("/", authenticated, updateLocale);

export default router;
