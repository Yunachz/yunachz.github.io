import { getCollection } from 'astro:content';
import { getPublishedProjects } from '../lib/projects';
import { sitePath } from '../lib/urls';

export const prerender = true;

export async function GET() {
  const siteEntries = await getCollection('site');
  const settings = siteEntries.find((entry) => entry.data.kind === 'settings')?.data;
  if (!settings || settings.kind !== 'settings') throw new Error('Konten settings situs tidak ditemukan.');
  const paths = ['/', '/projects/', ...(await getPublishedProjects()).map((project) => `/projects/${project.data.slug}/`)];
  const urls = paths.map((path) => `  <url><loc>${new URL(sitePath(path), settings.siteUrl).href}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
