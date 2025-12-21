import { Request, Response } from "express";
import { Project } from "@portafolio/shared-types";

const getProjects = (req: Request, res: Response) => {
  const projects: Project[] = [];
  return res.json(projects);
};

export default getProjects;
