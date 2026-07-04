import { Request, Response } from "express";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const getSecret = () => process.env.ADMIN_PASSWORD || "admin123";

export const generateSessionToken = () => {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24; // 24 horas de validez
  const payload = JSON.stringify({ expiresAt });
  const hmac = crypto.createHmac("sha256", getSecret());
  hmac.update(payload);
  const signature = hmac.digest("hex");
  return Buffer.from(JSON.stringify({ payload, signature })).toString("base64");
};

export const verifySessionToken = (token: string) => {
  try {
    const raw = Buffer.from(token, "base64").toString("utf-8");
    const { payload, signature } = JSON.parse(raw);
    const hmac = crypto.createHmac("sha256", getSecret());
    hmac.update(payload);
    const expectedSignature = hmac.digest("hex");
    if (signature !== expectedSignature) return false;
    
    const { expiresAt } = JSON.parse(payload);
    return Date.now() < expiresAt;
  } catch {
    return false;
  }
};

export const login = async (req: Request, res: Response) => {
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ error: "Contraseña requerida" });
  }
  
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  
  if (password === adminPassword) {
    const token = generateSessionToken();
    return res.json({ token, message: "Inicio de sesión exitoso" });
  }
  
  return res.status(401).json({ error: "Contraseña incorrecta" });
};

export const verify = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ valid: false, error: "Token no provisto o inválido" });
  }
  
  const token = authHeader.split(" ")[1];
  const isValid = verifySessionToken(token);
  
  if (isValid) {
    return res.json({ valid: true });
  } else {
    return res.status(401).json({ valid: false, error: "Token vencido o inválido" });
  }
};
