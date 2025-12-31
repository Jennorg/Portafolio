import { turso } from "./client";
import dotenv from "dotenv";

dotenv.config();

export const schema = async () => {
  try {
    console.log("Inicializando base de datos...");

    // --- CREACIÓN DE TABLAS ---
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY, 
        main_image_url TEXT,
        repository_url TEXT,
        live_demo_url TEXT,
        status TEXT NOT NULL DEFAULT 'completed',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // --- TABLA DE TRADUCCIONES ---
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS project_translations (
        project_id TEXT NOT NULL,
        language_code TEXT NOT NULL, -- 'es' o 'en'
        title TEXT NOT NULL,
        summary TEXT,
        description TEXT,
        PRIMARY KEY (project_id, language_code),
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      );
    `);

    // --- TABLA DE GALERÍA DE IMÁGENES ---
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS project_images (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        url TEXT NOT NULL,
        alt_text TEXT, -- Opcional: para accesibilidad o SEO
        order_index INTEGER DEFAULT 0, -- Para decidir qué imagen va primero
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      );
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS technologies (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        icon TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS project_technologies (
        project_id TEXT NOT NULL,
        technology_id TEXT NOT NULL,
        PRIMARY KEY (project_id, technology_id),
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (technology_id) REFERENCES technologies(id) ON DELETE CASCADE
      );
    `);

    console.log("Tablas creadas/verificadas.");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};
