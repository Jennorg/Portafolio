import express, { Request, Response } from "express";
import { schema } from "./db/schema";
import { turso } from "./db/client";
import projectRoutes from "./routes/project.routes";
import technologyRoutes from "./routes/technology.routes";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/projects", projectRoutes);
app.use("/api/technologies", technologyRoutes);

schema().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

const shutdown = async () => {
  console.log("\nCerrando conexiones...");
  await turso.close();
  process.exit(0);
};

process.on("SIGINT", shutdown); // Al presionar Ctrl+C
process.on("SIGTERM", shutdown); // Al ser terminado por el sistema
