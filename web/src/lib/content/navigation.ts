export interface NavProblemItem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  slug: string;
}
export interface NavSectionItem { name: string; slug: string; problems: NavProblemItem[]; }
export interface StudyPlanNavResponse { id: string; title: string; sections: NavSectionItem[]; }
