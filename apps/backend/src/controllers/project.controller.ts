import { Request, Response } from "express";
import { turso } from "../db/client";
import { v4 as uuidv4 } from "uuid";

export const getProjects = async (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || "es";

  try {
    const result = await turso.execute({
      sql: `
        SELECT 
          p.*, 
          pt.title, pt.summary, pt.description,
          t.id as tech_id, t.name as tech_name, t.category as tech_cat, t.icon as tech_icon
        FROM projects p
        LEFT JOIN project_translations pt ON p.id = pt.project_id AND pt.language_code = ?
        LEFT JOIN project_technologies ptech ON p.id = ptech.project_id
        LEFT JOIN technologies t ON ptech.technology_id = t.id
      `,
      args: [lang],
    });

    const projectsMap = new Map();

    result.rows.forEach((row: any) => {
      if (!projectsMap.has(row.id)) {
        projectsMap.set(row.id, {
          id: row.id,
          main_image_url: row.main_image_url,
          repository_url: row.repository_url,
          live_demo_url: row.live_demo_url,
          status: row.status,
          title: row.title,
          summary: row.summary,
          description: row.description,
          technologies: [],
        });
      }

      if (row.tech_id) {
        projectsMap.get(row.id).technologies.push({
          id: row.tech_id,
          name: row.tech_name,
          category: row.tech_cat,
          icon: row.tech_icon,
        });
      }
    });

    return res.json(Array.from(projectsMap.values()));
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Error al obtener los proyectos" });
  }
};

export const createProject = async (req: Request, res: Response) => {
  const {
    main_image_url,
    repository_url,
    live_demo_url,
    status,
    translations,
    technology_ids,
  } = req.body as {
    main_image_url: string;
    repository_url: string;
    live_demo_url: string;
    status: string;
    translations: Record<
      string,
      { title: string; summary: string; description: string }
    >;
    technology_ids: string[];
  };

  const projectId = uuidv4();

  try {
    await turso.batch(
      [
        {
          sql: `INSERT INTO projects (id, main_image_url, repository_url, live_demo_url, status) 
              VALUES (?, ?, ?, ?, ?)`,
          args: [
            projectId,
            main_image_url,
            repository_url,
            live_demo_url,
            status || "completed",
          ],
        },
        // Insertar traducciones dinámicamente
        ...Object.entries(translations).map(([lang, data]) => ({
          sql: `INSERT INTO project_translations (project_id, language_code, title, summary, description) 
              VALUES (?, ?, ?, ?, ?)`,
          args: [projectId, lang, data.title, data.summary, data.description],
        })),
        // Insertar relaciones de tecnologías
        ...(technology_ids || []).map((techId: string) => ({
          sql: `INSERT INTO project_technologies (project_id, technology_id) VALUES (?, ?)`,
          args: [projectId, techId],
        })),
      ],
      "write"
    );

    return res.status(201).json({
      id: projectId,
      message:
        "Proyecto creado exitosamente con sus traducciones y tecnologías",
    });
  } catch (error) {
    console.error("Error al crear proyecto:", error);
    return res
      .status(500)
      .json({ error: "Error al crear el proyecto en la base de datos" });
  }
};
