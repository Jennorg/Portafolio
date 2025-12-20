import type { Technology } from './technology';

export type ProjectStatus = 'completed' | 'in_progress' | 'archived';

export interface Project {
  id: string;
  title: string;
  summary: string | null;
  description: string | null;
  main_image_url: string | null;
  repository_url: string | null;
  live_demo_url: string | null;
  status: ProjectStatus;
  order_index: number;
  created_at: string | null;
  updated_at: string | null;
}
export interface ProjectWithTechnologies extends Project {
  technologies: Technology[];
}
