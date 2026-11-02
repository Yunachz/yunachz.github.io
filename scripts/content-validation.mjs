import path from 'node:path';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isHttpsUrl(value) {
  if (typeof value !== 'string') return false;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

export function normalizeProject(input, source = '<fixture>') {
  const errors = [];
  for (const field of ['slug', 'title', 'summary', 'category']) {
    if (typeof input?.[field] !== 'string' || input[field].trim() === '') errors.push(`${field} harus berupa teks non-kosong`);
  }
  if (typeof input?.slug === 'string' && !slugPattern.test(input.slug)) errors.push('slug harus lowercase-kebab-case');
  for (const field of ['draft', 'featured']) {
    if (input?.[field] !== undefined && typeof input[field] !== 'boolean') errors.push(`${field} harus boolean`);
  }
  if (input?.order !== undefined && !Number.isInteger(input.order)) errors.push('order harus integer');
  if (input?.tags !== undefined && (!Array.isArray(input.tags) || input.tags.some((tag) => typeof tag !== 'string' || tag.trim() === ''))) {
    errors.push('tags harus berupa daftar teks non-kosong');
  }
  for (const field of ['repositoryUrl', 'demoUrl']) {
    if (input?.[field] !== undefined && !isHttpsUrl(input[field])) errors.push(`${field} harus URL HTTPS yang valid`);
  }
  if (input?.cover !== undefined && (typeof input.cover !== 'string' || input.cover.trim() === '')) errors.push('cover harus berupa path non-kosong');
  if (input?.cover && (typeof input.alt !== 'string' || input.alt.trim() === '')) errors.push('alt wajib diisi jika cover ditentukan');
  if (input?.alt !== undefined && (typeof input.alt !== 'string' || input.alt.trim() === '')) errors.push('alt harus berupa teks non-kosong');
  for (const field of ['coverWidth', 'coverHeight']) {
    if (input?.[field] !== undefined && (!Number.isInteger(input[field]) || input[field] < 1)) errors.push(`${field} harus bilangan bulat positif`);
  }
  if (input?.cover && (!Number.isInteger(input.coverWidth) || input.coverWidth < 1 || !Number.isInteger(input.coverHeight) || input.coverHeight < 1)) {
    errors.push('coverWidth dan coverHeight wajib diisi jika cover ditentukan');
  }
  if (!input?.cover && (input?.coverWidth !== undefined || input?.coverHeight !== undefined)) errors.push('cover harus diisi jika dimensi cover ditentukan');
  if (input?.sourceLinks !== undefined && (!Array.isArray(input.sourceLinks) || input.sourceLinks.some((link) =>
    !link || typeof link.label !== 'string' || link.label.trim() === '' || !isHttpsUrl(link.url)))) {
    errors.push('sourceLinks harus memuat label dan URL HTTPS yang valid');
  }
  if (errors.length) throw new Error(`${source}: ${errors.join('; ')}`);
  return {
    ...input,
    slug: input.slug.trim(),
    title: input.title.trim(),
    summary: input.summary.trim(),
    category: input.category.trim().replace(/\s+/g, ' '),
    draft: input.draft ?? true,
    featured: input.featured ?? false,
    order: input.order ?? 100,
    tags: input.tags ?? [],
    sourceLinks: input.sourceLinks ?? [],
  };
}

export function validateProjectSet(inputs, options = {}) {
  const normalized = inputs.map((input) => normalizeProject(input.data ?? input, input.source ?? '<fixture>'));
  const seen = new Set();
  for (const project of normalized) {
    if (seen.has(project.slug)) throw new Error(`slug duplikat: ${project.slug}`);
    seen.add(project.slug);
    if (project.cover) {
      const relative = project.cover.replace(/^\/+/, '');
      const resolved = path.posix.normalize(relative);
      if (!resolved.startsWith('assets/projects/') || resolved.startsWith('../')) {
        throw new Error(`${project.slug}: cover harus berada di public/assets/projects/`);
      }
      if (options.assetExists && !options.assetExists(resolved)) {
        throw new Error(`${project.slug}: aset cover tidak ditemukan public/${resolved}`);
      }
    }
  }
  return normalized;
}

export function visibleProjects(projects) {
  return projects.filter((project) => project.draft === false);
}

export function orderedProjects(projects) {
  return [...projects].sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
}
