import { getCollection, type CollectionEntry } from 'astro:content';

export type ProjectEntry = CollectionEntry<'projects'>;

export function sortProjects<T extends { data: { order: number; slug?: string }; id?: string }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => a.data.order - b.data.order || (a.data.slug ?? a.id ?? '').localeCompare(b.data.slug ?? b.id ?? ''));
}

export function groupByCategory<T extends { id?: string; data: { category: string; order: number; slug?: string } }>(entries: T[]) {
  const groups = new Map<string, T[]>();
  for (const entry of sortProjects(entries)) {
    const group = groups.get(entry.data.category) ?? [];
    group.push(entry);
    groups.set(entry.data.category, group);
  }
  return [...groups.entries()].map(([category, items]) => ({ category, items }));
}

export function onlyPublished<T extends { data: { draft: boolean } }>(entries: T[]): T[] {
  return entries.filter((entry) => !entry.data.draft);
}

export async function getPublishedProjects(): Promise<ProjectEntry[]> {
  return sortProjects(onlyPublished(await getCollection('projects')));
}

export async function getFeaturedProjects(limit = 6): Promise<ProjectEntry[]> {
  return (await getPublishedProjects()).filter((project) => project.data.featured).slice(0, limit);
}
