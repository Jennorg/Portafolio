import { Request, Response, NextFunction } from "express";
import { verifySessionToken } from "../controllers/auth.controller";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No autorizado. Token no provisto o inválido." });
  }
  
  const token = authHeader.split(" ")[1];
  const isValid = verifySessionToken(token);
  
  if (!isValid) {
    return res.status(401).json({ error: "No autorizado. Token vencido o inválido." });
  }
  
  next();
};
