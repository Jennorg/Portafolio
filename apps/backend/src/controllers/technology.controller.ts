import { Request, Response } from "express";
import { turso } from "../db/client";

let technologiesCache: any = null;

export const clearTechnologiesCache = () => {
  console.log("[technologiesCache] Clearing technologies cache...");
  technologiesCache = null;
};

export const getTechnologies = async (req: Request, res: Response) => {
  if (technologiesCache) {
    console.log("[getTechnologies] Serving technologies from backend memory cache");
    return res.json(technologiesCache);
  }

  try {
    const technologies = await turso.execute("SELECT * FROM technologies");
    technologiesCache = technologies.rows;
    return res.json(technologiesCache);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Error al obtener las tecnologías" });
  }
};
