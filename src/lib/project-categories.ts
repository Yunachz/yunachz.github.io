export type Locale = 'id' | 'en';
import categoryRegistry from './project-categories.json' with { type: 'json' };

export type ProjectCategory = {
  id: string;
  label: Record<Locale, string>;
  order: number;
};

export const projectCategories = categoryRegistry as ProjectCategory[];

export function categoryLabelForProject(categoryIds: string[], registry: ProjectCategory[] = projectCategories): Record<Locale, string> {
  const selected = registry
    .filter(({ id }) => categoryIds.includes(id))
    .sort((a, b) => a.order - b.order);
  return {
    id: selected.map(({ label }) => label.id).join(' · '),
    en: selected.map(({ label }) => label.en).join(' · '),
  };
}

export function categoriesForProjects<T extends { categoryIds: string[] }>(projects: T[]) {
  const present = new Set(projects.flatMap(({ categoryIds }) => categoryIds));
  return projectCategories
    .filter(({ id }) => present.has(id))
    .sort((a, b) => a.order - b.order);
}
