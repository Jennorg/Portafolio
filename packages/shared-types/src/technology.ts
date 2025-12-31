export type TechnologyCategory =
  | "language"
  | "frontend"
  | "backend"
  | "database"
  | "tools"
  | "devops";

export interface Technology {
  id: string;
  name: string;
  category: TechnologyCategory;
  logo_url: string;
  created_at: string;
}
