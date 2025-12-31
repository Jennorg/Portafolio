import { Router } from "express";
import { getTechnologies } from "../controllers/technology.controller";

const router = Router();

router.get("/", getTechnologies);

export default router;
