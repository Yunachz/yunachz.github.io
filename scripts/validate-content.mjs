import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { validatePortfolioRecords, validateProjectSet } from './content-validation.mjs';

const projectDir = path.resolve('src/content/projects');
const publicDir = path.resolve('public');
const reservedSectionIds = new Set(['projects', 'skills', 'experience', 'education', 'credentials', 'contact', 'main-content']);

async function filesWithExtension(directory, extension) {
  try {
    return (await readdir(directory)).filter((file) => file.endsWith(extension)).sort();
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function readJsonCollection(name) {
  const directory = path.resolve('src/content', name);
  const files = await filesWithExtension(directory, '.json');
  return Promise.all(files.map(async (file) => ({
    source: `src/content/${name}/${file}`,
    data: JSON.parse(await readFile(path.join(directory, file), 'utf8')),
  })));
}

async function validateOptionalAsset(value, expectedPrefix, label, allowHttps = false) {
  if (!value) return;
  if (allowHttps && typeof value === 'string' && value.startsWith('https://')) return;
  const relative = String(value).replace(/^\/+/, '');
  const normalized = path.posix.normalize(relative);
  if (!normalized.startsWith(expectedPrefix) || normalized.startsWith('../')) {
    throw new Error(`${label}: path harus berada di public/${expectedPrefix}`);
  }
  if (!existsSync(path.join(publicDir, normalized))) throw new Error(`${label}: aset tidak ditemukan public/${normalized}`);
}

async function main() {
  const files = await filesWithExtension(projectDir, '.md');
  const inputs = await Promise.all(files.map(async (file) => ({
    source: `src/content/projects/${file}`,
    data: matter(await readFile(path.join(projectDir, file), 'utf8')).data,
  })));
  const projects = validateProjectSet(inputs, {
    assetExists: (asset) => existsSync(path.join(publicDir, asset)),
  });
  const publicSlugs = new Set(projects.filter((project) => !project.draft).map((project) => project.slug));

  const sectionFiles = await filesWithExtension(path.resolve('src/content/sections'), '.md');
  const sectionSlugs = new Set();
  for (const file of sectionFiles) {
    const source = `src/content/sections/${file}`;
    const data = matter(await readFile(path.resolve('src/content/sections', file), 'utf8')).data;
    if (reservedSectionIds.has(data.slug)) throw new Error(`${source}: slug section bertabrakan dengan ID navigasi/halaman`);
    if (sectionSlugs.has(data.slug)) throw new Error(`${source}: slug section duplikat: ${data.slug}`);
    sectionSlugs.add(data.slug);
  }

  const siteEntries = await readJsonCollection('site');
  const profile = siteEntries.find((entry) => entry.data.kind === 'profile')?.data;
  const contact = siteEntries.find((entry) => entry.data.kind === 'contact')?.data;
  const settings = siteEntries.find((entry) => entry.data.kind === 'settings')?.data;
  if (!profile || !contact || !settings) throw new Error('Koleksi src/content/site harus memuat profile, contact, dan settings.');
  await validateOptionalAsset(profile.photo, 'assets/profile/', 'site/profile.json photo');
  await validateOptionalAsset(profile.cv, 'assets/documents/', 'site/profile.json cv', true);

  const skills = await readJsonCollection('skills');
  const experience = await readJsonCollection('experience');
  const education = await readJsonCollection('education');
  const credentials = await readJsonCollection('credentials');
  const profileCounts = validatePortfolioRecords({ profile, contact, skills, experience, education, credentials });

  for (const { source, data } of skills) {
    if (data.draft !== false) continue;
    for (const slug of data.projectSlugs ?? []) {
      if (!publicSlugs.has(slug)) throw new Error(`${source}: projectSlugs merujuk proyek yang belum terbit atau tidak ada: ${slug}`);
    }
  }

  for (const { source, data } of credentials) {
    await validateOptionalAsset(data.document, 'assets/documents/', `${source} document`, true);
    await validateOptionalAsset(data.image, 'assets/certificates/', `${source} image`);
  }

  console.log(`Konten proyek valid: ${projects.length} entry (${projects.filter((project) => !project.draft).length} terbit, ${projects.filter((project) => project.draft).length} draft).`);
  console.log(`Konten CV valid: ${profileCounts.skills} skill, ${profileCounts.experience} pengalaman, ${profileCounts.education} pendidikan/pelatihan, ${profileCounts.credentials} sertifikasi terbit.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
