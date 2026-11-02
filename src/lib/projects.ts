import { getCollection, type CollectionEntry } from 'astro:content';

export type ProjectEntry = CollectionEntry<'projects'>;

export function sortProjects<T extends { data: { order: number; slug?: string }; id?: string }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => a.data.order - b.data.order || (a.data.slug ?? a.id ?? '').localeCompare(b.data.slug ?? b.id ?? ''));
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
