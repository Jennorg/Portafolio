import { Router } from "express";
import { getProjects, createProject, deleteProject } from "../controllers/project.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getProjects);
router.post("/", requireAuth, createProject);
router.delete("/:id", requireAuth, deleteProject);

export default router;
