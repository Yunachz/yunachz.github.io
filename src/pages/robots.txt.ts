import { getCollection } from 'astro:content';
import { sitePath } from '../lib/urls';

export const prerender = true;

export async function GET() {
  const siteEntries = await getCollection('site');
  const settings = siteEntries.find((entry) => entry.data.kind === 'settings')?.data;
  if (!settings || settings.kind !== 'settings') throw new Error('Konten settings situs tidak ditemukan.');
  const sitemap = new URL(sitePath('/sitemap.xml'), settings.siteUrl).href;
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
