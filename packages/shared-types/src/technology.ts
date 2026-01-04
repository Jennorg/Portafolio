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
  icon: string;
  created_at: string;
}
