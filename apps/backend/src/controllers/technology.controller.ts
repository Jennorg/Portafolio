import { Request, Response } from "express";
import { turso } from "../db/client";

export const getTechnologies = async (req: Request, res: Response) => {
  try {
    const technologies = await turso.execute("SELECT * FROM technologies");
    return res.json(technologies.rows);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Error al obtener las tecnologías" });
  }
};
