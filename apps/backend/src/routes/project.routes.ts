import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Estos son mis projectos" });
});

export default router;
