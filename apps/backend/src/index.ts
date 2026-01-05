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

schema().catch(console.error);

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;

const shutdown = async () => {
  console.log("\nCerrando conexiones...");
  await turso.close();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
