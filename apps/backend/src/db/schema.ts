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

    // --- SEMILLERO DE TECNOLOGÍAS ---
    const techCheck = await turso.execute("SELECT COUNT(*) as count FROM technologies");
    const count = (techCheck.rows[0] as any).count;
    if (count === 0) {
      console.log("Sembrando tecnologías iniciales...");
      const initialTechs = [
        { id: "js", name: "JavaScript", category: "language", icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 3h18v18H3V3zm12.525 15.603c1.107 0 1.956-.375 2.548-1.125.485-.615.713-1.455.713-2.88h-2.1c0 1.05-.21 1.545-.788 1.845-.375.195-.885.255-1.305.255-1.275 0-1.89-.66-1.89-2.145V13.8c0-1.29.615-1.95 1.89-1.95.84 0 1.395.27 1.74.84.21.36.27.765.27 1.53h2.1c0-1.26-.39-2.22-1.14-2.865-.735-.615-1.8-.93-3.15-.93-1.635 0-2.82.495-3.48 1.485-.51.765-.675 1.74-.675 3.015v1.275c0 1.29.18 2.295.705 3.06.66.975 1.86 1.47 3.51 1.47zm-7.665-.24c1.17 0 2.01-.39 2.52-1.17.48-.735.63-1.815.63-3.12v-1.17h-2.22v1.23c0 .99-.18 1.515-.57 1.815-.36.27-.855.33-1.215.33-.87 0-1.395-.42-1.395-1.875v-.885c0-1.44.525-1.875 1.395-1.875.48 0 .975.15 1.245.54.27.375.33.885.33 1.62h2.22c0-1.275-.3-2.25-.915-2.865-.63-.645-1.665-.96-3.03-.96-1.605 0-2.73.51-3.33 1.485-.525.855-.66 1.935-.66 3.24v.66c0 1.32.135 2.4.66 3.255.615.99 1.725 1.5 3.33 1.5z"/></svg>` },
        { id: "ts", name: "TypeScript", category: "language", icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 3h18v18H3V3zm12.525 15.603c1.107 0 1.956-.375 2.548-1.125.485-.615.713-1.455.713-2.88h-2.1c0 1.05-.21 1.545-.788 1.845-.375.195-.885.255-1.305.255-1.275 0-1.89-.66-1.89-2.145V13.8c0-1.29.615-1.95 1.89-1.95.84 0 1.395.27 1.74.84.21.36.27.765.27 1.53h2.1c0-1.26-.39-2.22-1.14-2.865-.735-.615-1.8-.93-3.15-.93-1.635 0-2.82.495-3.48 1.485-.51.765-.675 1.74-.675 3.015v1.275c0 1.29.18 2.295.705 3.06.66.975 1.86 1.47 3.51 1.47zm-5.745-.24V9.6h-2.91v2.19h8.04v2.19h-2.91v4.38h-2.22z"/></svg>` },
        { id: "html", name: "HTML5", category: "frontend", icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0zm17.3 5.6H5.2l.4 4.8h11.2l-.4 4.5-4.4 1.5-4.4-1.5-.2-2.8h-2l.4 5.3 6.2 2 6.2-2 .8-9.3H19l-.2-2z"/></svg>` },
        { id: "css", name: "CSS3", category: "frontend", icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0zm16.5 5.6H6.8l.2 2.8h10.8l-.3 3H7.2l.2 2.8h10.2l-.5 5.5-5.1 1.7-5.1-1.7-.3-3.5h-2l.5 6.2 6.9 2.3 6.9-2.3 1-11.3H7.8l-.2-2.8h10.6l-.2-3z"/></svg>` },
        { id: "react", name: "React", category: "frontend", icon: `<svg viewBox="-11.5 -10.23174 23 20.46348"><ellipse rx="11" ry="4.2" style="fill: none !important; stroke: currentColor !important; stroke-width: 1px;"/><ellipse rx="11" ry="4.2" transform="rotate(60)" style="fill: none !important; stroke: currentColor !important; stroke-width: 1px;"/><ellipse rx="11" ry="4.2" transform="rotate(120)" style="fill: none !important; stroke: currentColor !important; stroke-width: 1px;"/><circle cx="0" cy="0" r="2" style="fill: currentColor !important; stroke: none !important;"/></svg>` },
        { id: "astro", name: "Astro", category: "frontend", icon: `<svg viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 4.2l6.2 12.4H5.8L12 6.2z" style="fill: none !important; stroke: currentColor !important; stroke-width: 2px;"/></svg>` },
        { id: "node", name: "Node.js", category: "backend", icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4 6.5v9L12 20l8-4.5v-9L12 2zm6 12.3l-6 3.4-6-3.4v-6.6l6-3.4 6 3.4v6.6zm-8.8-3.9c.4.6 1.1 1 1.9 1 1.2 0 2.1-.9 2.1-2.1s-.9-2.1-2.1-2.1c-.8 0-1.5.4-1.9 1h-.3V7.2H7.2v6.6h1.7v-2.5h.3zm2.5-1.1c0-.4.3-.7.7-.7s.7.3.7.7c0 .4-.3.7-.7.7s-.7-.3-.7-.7z"/></svg>` },
        { id: "express", name: "Express", category: "backend", icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 4.02 2 6.5v11C2 19.98 6.48 22 12 22s10-2.02 10-4.5v-11C22 4.02 17.52 2 12 2zm-1.75 14h-1.5v-6h1.5v6zm3.5 0h-1.5v-6h1.5v6zm2.5 0h-1.5v-6.5H13v-1.5h3.25V16z"/></svg>` },
        { id: "sqlite", name: "SQLite", category: "database", icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 4.02 2 6.5v11c0 2.48 4.48 4.5 10 4.5s10-2.02 10-4.5v-11C22 4.02 17.52 2 12 2zm0 3c4.97 0 8 1.52 8 1.5S16.97 8 12 8s-8-1.48-8-1.5 3.03-1.5 8-1.5zm0 11c-4.97 0-8-1.52-8-1.5s3.03-1.5 8-1.5 8 1.48 8 1.5-3.03 1.5-8 1.5zm0 4.5c-4.97 0-8-1.52-8-1.5s3.03-1.5 8-1.5 8 1.48 8 1.5-3.03 1.5-8 1.5z"/></svg>` },
        { id: "git", name: "Git", category: "tools", icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.6 10.5l9.3-9.3c.4-.4 1-.4 1.4 0l9.3 9.3c.4.4.4 1 0 1.4l-9.3 9.3c-.4.4-1 .4-1.4 0l-9.3-9.3c-.4-.4-.4-1 0-1.4zm10.7-3.9a1.5 1.5 0 1 0-2.1 2.1l1.5 1.5a1.5 1.5 0 0 0 .6.7v2.5c-.4.3-.6.7-.6 1.2a1.5 1.5 0 1 0 3 0c0-.5-.2-.9-.6-1.2V9.8a1.5 1.5 0 0 0-1.8-1.5V6.6z"/></svg>` },
      ];
      for (const tech of initialTechs) {
        await turso.execute({
          sql: "INSERT INTO technologies (id, name, category, icon) VALUES (?, ?, ?, ?)",
          args: [tech.id, tech.name, tech.category, tech.icon]
        });
      }
      console.log("Tecnologías sembradas exitosamente.");
    }

    // --- SEMILLERO DE PROYECTOS ---
    const projectCheck = await turso.execute("SELECT COUNT(*) as count FROM projects");
    const projectCount = (projectCheck.rows[0] as any).count;
    if (projectCount === 0) {
      console.log("Sembrando proyectos iniciales...");
      
      const initialProjects = [
        {
          id: "p1",
          main_image_url: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
          repository_url: "https://github.com/jenfer/ecommerce-api",
          live_demo_url: "https://ecommerce-demo.vercel.app",
          status: "completed",
          translations: [
            {
              lang: "es",
              title: "E-Commerce API & Panel de Control",
              summary: "Una API REST robusta y panel de control para gestionar ventas, inventario y usuarios de una tienda en línea.",
              description: "Desarrollado con Node.js, Express y SQLite. Cuenta con autenticación JWT, pasarela de pagos integrada en modo pruebas (Stripe), gestión completa de productos y roles de usuario."
            },
            {
              lang: "en",
              title: "E-Commerce API & Dashboard",
              summary: "A robust REST API and dashboard to manage sales, inventory, and users for an online store.",
              description: "Developed with Node.js, Express, and SQLite. Features JWT authentication, mock payment gateway integration (Stripe), and full product and user role management."
            }
          ],
          technologies: ["ts", "node", "express", "sqlite", "git"]
        },
        {
          id: "p2",
          main_image_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
          repository_url: "https://github.com/jenfer/portfolio-cms",
          live_demo_url: "https://portfolio-demo.vercel.app",
          status: "completed",
          translations: [
            {
              lang: "es",
              title: "Portafolio Profesional con CMS",
              summary: "Mi sitio web personal diseñado para mostrar mis habilidades, stack tecnológico y proyectos destacados.",
              description: "Este mismo sitio web. Utiliza Astro para una carga ultrarrápida, React para interactividad en el CMS de administración de proyectos, y Tailwind CSS para un diseño animado y dinámico."
            },
            {
              lang: "en",
              title: "Professional Portfolio with CMS",
              summary: "My personal website designed to showcase my skills, tech stack, and featured projects.",
              description: "This very website. Built with Astro for ultra-fast loading speed, React for administration CMS interactivity, and Tailwind CSS for an animated and dynamic design."
            }
          ],
          technologies: ["astro", "react", "ts", "html", "css", "git"]
        },
        {
          id: "p3",
          main_image_url: "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?auto=format&fit=crop&w=800&q=80",
          repository_url: "https://github.com/jenfer/collaborative-todo",
          live_demo_url: "https://taskmanager-demo.vercel.app",
          status: "in_progress",
          translations: [
            {
              lang: "es",
              title: "Gestor de Tareas Colaborativo",
              summary: "Una aplicación en tiempo real para organizar proyectos, asignar tareas y colaborar con equipos de trabajo.",
              description: "Desarrollada en React y Node.js. Permite crear tableros al estilo Kanban, arrastrar y soltar tareas, establecer fechas límite e interactuar en tiempo real con otros miembros."
            },
            {
              lang: "en",
              title: "Collaborative Task Manager",
              summary: "A real-time application to organize projects, assign tasks, and collaborate with teams.",
              description: "Developed with React and Node.js. Allows creating Kanban-style boards, drag-and-drop tasks, setting deadlines, and real-time interaction with team members."
            }
          ],
          technologies: ["react", "js", "node", "express", "git"]
        }
      ];

      for (const proj of initialProjects) {
        // 1. Insertar proyecto base
        await turso.execute({
          sql: "INSERT INTO projects (id, main_image_url, repository_url, live_demo_url, status) VALUES (?, ?, ?, ?, ?)",
          args: [proj.id, proj.main_image_url, proj.repository_url, proj.live_demo_url, proj.status]
        });

        // 2. Insertar traducciones
        for (const trans of proj.translations) {
          await turso.execute({
            sql: "INSERT INTO project_translations (project_id, language_code, title, summary, description) VALUES (?, ?, ?, ?, ?)",
            args: [proj.id, trans.lang, trans.title, trans.summary, trans.description]
          });
        }

        // 3. Vincular tecnologías
        for (const techId of proj.technologies) {
          await turso.execute({
            sql: "INSERT INTO project_technologies (project_id, technology_id) VALUES (?, ?)",
            args: [proj.id, techId]
          });
        }
      }
      console.log("Proyectos sembrados exitosamente.");
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};
