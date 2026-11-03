import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const monthPattern = /^\d{4}-(0[1-9]|1[0-2])$/;
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.svg', '.webp']);
const assetExtensions = new Set([...imageExtensions, '.pdf']);
const photoDirectories = {
  profile: 'assets/profile/',
  project: 'assets/projects/',
  skill: 'assets/skills/',
  experience: 'assets/experience/',
  credential: 'assets/certificates/',
};
const prohibitedPublicCopy = /tercantum pada CV|telah diverifikasi|batas informasi|audit dokumentasi|verifikasi proyek/i;

function requireCondition(condition, message) {
  if (!condition) throw new Error(message);
}

function requireText(value, label) {
  requireCondition(typeof value === 'string' && value.trim().length > 0, `${label} wajib berisi teks`);
}

function requireLocalized(value, label) {
  requireText(value?.id, `${label}.id`);
  requireText(value?.en, `${label}.en`);
}

function requireTextList(value, label, minimum = 0) {
  requireCondition(Array.isArray(value) && value.length >= minimum, `${label} harus berupa daftar dengan sedikitnya ${minimum} item`);
  value.forEach((item, index) => requireText(item, `${label}[${index}]`));
}

function requireUrl(value, label, optional = false) {
  if (optional && value === undefined) return;
  try {
    requireCondition(new URL(value).protocol === 'https:', `${label} harus memakai HTTPS`);
  } catch {
    throw new Error(`${label} harus berupa URL HTTPS yang valid`);
  }
}

function requireLocalAsset(value, label, publicRoot, expectedDirectory) {
  requireText(value, label);
  const raw = value.replace(/^\/+/, '');
  requireCondition(!raw.split('/').includes('..') && !raw.includes('\\'), `${label} tidak boleh keluar dari public/assets`);
  const relative = path.posix.normalize(raw);
  requireCondition(relative.startsWith('assets/'), `${label} harus berada di public/assets/`);
  requireCondition(relative.startsWith(expectedDirectory), `${label} harus berada di ${expectedDirectory}`);
  requireCondition(assetExtensions.has(path.posix.extname(relative).toLowerCase()), `${label} memakai format gambar atau dokumen yang tidak didukung`);
  const publicPath = path.resolve(publicRoot);
  const absolutePath = path.resolve(publicPath, ...relative.split('/'));
  requireCondition(absolutePath.startsWith(`${publicPath}${path.sep}`), `${label} keluar dari direktori public`);
  requireCondition(existsSync(absolutePath), `${label} tidak ditemukan: public/${relative}`);
  return relative;
}

function requireMedia(media, source, publicRoot, collection) {
  requireCondition(media && typeof media === 'object', `${source}: media wajib diisi`);
  requireCondition(Number.isInteger(media.width) && media.width > 0 && Number.isInteger(media.height) && media.height > 0, `${source}: media memerlukan dimensi positif`);
  requireCondition(media.kind === 'photo' || media.kind === 'placeholder', `${source}: media.kind tidak valid`);
  const expectedDirectory = media.kind === 'placeholder' ? 'assets/placeholders/' : photoDirectories[collection];
  const relative = requireLocalAsset(media.src, `${source} media.src`, publicRoot, expectedDirectory);
  requireCondition(imageExtensions.has(path.posix.extname(relative).toLowerCase()), `${source}: media harus berupa gambar`);
  if (collection === 'credential' && media.kind === 'photo') requireLocalized(media.alt, `${source} media.alt`);
  return relative;
}

function requireDates(dates, source) {
  requireCondition(dates && monthPattern.test(dates.start ?? ''), `${source}: tanggal mulai tidak valid`);
  requireCondition(['range', 'ongoing', 'single'].includes(dates.kind), `${source}: jenis tanggal tidak valid`);
  requireCondition(dates.kind !== 'range' || monthPattern.test(dates.end ?? ''), `${source}: rentang memerlukan tanggal akhir`);
  requireCondition(dates.kind === 'range' || dates.end === undefined, `${source}: tanggal akhir hanya untuk rentang`);
  requireCondition(dates.kind !== 'range' || dates.end >= dates.start, `${source}: tanggal akhir harus sama atau setelah tanggal mulai`);
}

function published(entries) {
  return entries.filter(({ data }) => data.draft === false);
}

export async function loadV3Content(rootDirectory = process.cwd()) {
  const root = path.resolve(rootDirectory);
  const publicRoot = path.join(root, 'public');
  async function jsonCollection(name) {
    const directory = path.join(root, 'src/content', name);
    const files = (await readdir(directory)).filter((file) => file.endsWith('.json')).sort();
    return Promise.all(files.map(async (file) => ({
      id: file.replace(/\.json$/, ''),
      source: `src/content/${name}/${file}`,
      data: JSON.parse(await readFile(path.join(directory, file), 'utf8')),
    })));
  }

  const projectDirectory = path.join(root, 'src/content/projects');
  const projectFiles = (await readdir(projectDirectory)).filter((file) => file.endsWith('.md')).sort();
  const projects = await Promise.all(projectFiles.map(async (file) => ({
    source: `src/content/projects/${file}`,
    data: matter(await readFile(path.join(projectDirectory, file), 'utf8')).data,
  })));
  const about = matter(await readFile(path.join(root, 'src/content/sections/about.md'), 'utf8'));
  return {
    projects,
    siteEntries: await jsonCollection('site'),
    skills: await jsonCollection('skills'),
    software: await jsonCollection('software'),
    experience: await jsonCollection('experience'),
    education: await jsonCollection('education'),
    credentials: await jsonCollection('credentials'),
    categoryRegistry: JSON.parse(await readFile(path.join(root, 'src/lib/project-categories.json'), 'utf8')),
    publicRoot,
    aboutDraft: about.data.draft,
  };
}

export function validateV3Content(snapshot) {
  const { projects, siteEntries, skills, software, experience, education, credentials, categoryRegistry, publicRoot, aboutDraft } = snapshot;
  const collections = { projects, skills, software, experience, education, credentials };
  for (const [name, entries] of Object.entries(collections)) requireCondition(Array.isArray(entries), `${name} harus berupa daftar`);

  const categoryIds = new Set();
  for (const category of categoryRegistry) {
    requireCondition(category && typeof category.id === 'string' && slugPattern.test(category.id), 'ID kategori tidak valid');
    requireCondition(!categoryIds.has(category.id), `ID kategori duplikat: ${category.id}`);
    requireLocalized(category.label, `Kategori ${category.id}`);
    requireCondition(Number.isInteger(category.order), `Urutan kategori ${category.id} tidak valid`);
    categoryIds.add(category.id);
  }

  const projectSlugs = new Set();
  const publicProjectSlugs = new Set();
  for (const { source, data } of projects) {
    requireCondition(typeof data.slug === 'string' && slugPattern.test(data.slug), `${source}: slug tidak valid`);
    requireCondition(!projectSlugs.has(data.slug), `${source}: slug duplikat ${data.slug}`);
    projectSlugs.add(data.slug);
    if (data.draft === false) publicProjectSlugs.add(data.slug);
    requireText(data.title, `${source} title`);
    requireCondition(Array.isArray(data.categoryIds) && data.categoryIds.length > 0, `${source}: categoryIds wajib diisi`);
    requireCondition(new Set(data.categoryIds).size === data.categoryIds.length, `${source}: categoryIds tidak boleh duplikat`);
    for (const categoryId of data.categoryIds) requireCondition(categoryIds.has(categoryId), `${source}: kategori tidak terdaftar ${categoryId}`);
    for (const locale of ['id', 'en']) {
      requireText(data.copy?.[locale]?.summary, `${source} copy.${locale}.summary`);
      requireTextList(data.copy?.[locale]?.paragraphs, `${source} copy.${locale}.paragraphs`, 1);
      requireText(data.copy?.[locale]?.imageAlt, `${source} copy.${locale}.imageAlt`);
    }
    requireCondition(data.copy.id.paragraphs.length === data.copy.en.paragraphs.length, `${source}: jumlah paragraf ID dan EN harus sama`);
    requireMedia(data.media, source, publicRoot, 'project');
    requireTextList(data.tags ?? [], `${source} tags`);
    requireUrl(data.repositoryUrl, `${source} repositoryUrl`, true);
    requireUrl(data.demoUrl, `${source} demoUrl`, true);
    requireCondition(Array.isArray(data.sourceLinks ?? []), `${source}: sourceLinks harus berupa daftar`);
    for (const link of data.sourceLinks ?? []) {
      requireCondition(typeof link.labelKey === 'string' && slugPattern.test(link.labelKey), `${source}: label sumber tidak valid`);
      requireUrl(link.url, `${source} source URL`);
    }
  }

  const profile = siteEntries.find(({ data }) => data.kind === 'profile')?.data;
  const contact = siteEntries.find(({ data }) => data.kind === 'contact')?.data;
  requireCondition(profile && contact, 'Profile dan contact wajib tersedia');
  requireText(profile.name, 'profile.name');
  if (profile.location !== undefined) requireText(profile.location, 'profile.location');
  if (profile.gpa !== undefined) requireCondition(typeof profile.gpa === 'number' && Number.isFinite(profile.gpa) && profile.gpa > 0, 'profile.gpa harus angka positif');
  for (const locale of ['id', 'en']) {
    for (const field of ['field', 'summary', 'cvSummary', 'photoAlt']) requireText(profile.copy?.[locale]?.[field], `profile.copy.${locale}.${field}`);
  }
  requireCondition(Array.isArray(profile.languages), 'profile.languages harus berupa daftar');
  for (const language of profile.languages) {
    requireCondition(typeof language.id === 'string' && slugPattern.test(language.id), 'ID bahasa pada profile tidak valid');
    requireLocalized(language.name, `profile.languages.${language.id}.name`);
    requireLocalized(language.level, `profile.languages.${language.id}.level`);
  }
  if (profile.photo !== undefined) requireMedia({ src: profile.photo, width: profile.photoWidth, height: profile.photoHeight, kind: 'photo' }, 'profile portrait', publicRoot, 'profile');
  requireCondition(profile.cvByLocale && typeof profile.cvByLocale === 'object', 'profile.cvByLocale wajib diisi');
  for (const locale of ['id', 'en']) {
    const cvPath = profile.cvByLocale[locale];
    const relative = requireLocalAsset(cvPath, `CV ${locale}`, publicRoot, 'assets/documents/');
    requireCondition(path.posix.extname(relative).toLowerCase() === '.pdf', `CV ${locale} harus PDF`);
  }
  requireCondition(profile.cvByLocale.id !== profile.cvByLocale.en, 'CV ID dan EN harus mengarah ke berkas berbeda');
  requireUrl(contact.github, 'contact.github');
  if (contact.linkedin !== undefined) requireUrl(contact.linkedin, 'contact.linkedin');
  if (contact.whatsapp !== undefined) requireUrl(contact.whatsapp, 'contact.whatsapp');
  if (contact.email !== undefined) requireCondition(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact.email), 'contact.email tidak valid');
  if (contact.phone !== undefined) requireCondition(/^\+\d{10,15}$/.test(contact.phone), 'contact.phone harus format E.164');

  for (const { source, data } of skills) {
    for (const locale of ['id', 'en']) {
      for (const field of ['title', 'shortLabel', 'summary']) requireText(data.copy?.[locale]?.[field], `${source} copy.${locale}.${field}`);
      if (data.copy?.[locale]?.imageAlt !== undefined) requireText(data.copy[locale].imageAlt, `${source} copy.${locale}.imageAlt`);
    }
    requireMedia(data.media, source, publicRoot, 'skill');
    const references = data.projectSlugs ?? [];
    requireCondition(Array.isArray(references), `${source}: projectSlugs harus berupa daftar`);
    for (const slug of references) {
      requireCondition(projectSlugs.has(slug), `${source}: projectSlugs memuat proyek tidak dikenal ${slug}`);
      if (data.draft === false) requireCondition(publicProjectSlugs.has(slug), `${source}: proyek draft tidak dapat dirujuk dari konten terbit`);
    }
  }

  for (const { source, data } of experience) {
    for (const locale of ['id', 'en']) {
      for (const field of ['category', 'role', 'summary', 'imageAlt']) requireText(data.copy?.[locale]?.[field], `${source} copy.${locale}.${field}`);
      requireTextList(data.copy?.[locale]?.details, `${source} copy.${locale}.details`, 1);
    }
    requireCondition(data.copy.id.details.length === data.copy.en.details.length, `${source}: jumlah detail ID dan EN harus sama`);
    requireDates(data.dates, source);
    requireMedia(data.media, source, publicRoot, 'experience');
  }

  for (const { source, data } of education) {
    requireText(data.institution, `${source} institution`);
    for (const locale of ['id', 'en']) {
      requireText(data.copy?.[locale]?.program, `${source} copy.${locale}.program`);
      if (data.copy?.[locale]?.summary !== undefined) requireText(data.copy[locale].summary, `${source} copy.${locale}.summary`);
    }
    requireDates(data.dates, source);
    if (data.logo !== undefined) {
      requireCondition(data.logo && typeof data.logo === 'object', `${source}: logo harus berupa objek`);
      requireCondition(Number.isInteger(data.logo.width) && data.logo.width > 0 && Number.isInteger(data.logo.height) && data.logo.height > 0, `${source}: logo memerlukan dimensi positif`);
      const relative = requireLocalAsset(data.logo.src, `${source} logo.src`, publicRoot, 'assets/education/');
      requireCondition(imageExtensions.has(path.posix.extname(relative).toLowerCase()), `${source}: logo harus berupa gambar`);
    }
  }

  for (const { source, data } of credentials) {
    requireText(data.name, `${source} name`);
    requireMedia(data.media, source, publicRoot, 'credential');
    if (data.issuer !== undefined) requireText(data.issuer, `${source} issuer`);
    if (data.issuedAt !== undefined) requireText(data.issuedAt, `${source} issuedAt`);
    if (data.verifyUrl !== undefined) requireUrl(data.verifyUrl, `${source} verifyUrl`);
    if (data.document !== undefined) requireLocalAsset(data.document, `${source} document`, publicRoot, 'assets/documents/');
  }

  const softwareIds = new Set();
  const softwareNames = new Set();
  for (const { source, id, data } of software) {
    requireCondition(typeof id === 'string' && slugPattern.test(id), `${source}: ID software tidak valid`);
    requireCondition(!softwareIds.has(id), `${source}: ID software duplikat ${id}`);
    requireCondition(!softwareNames.has(data.name), `${source}: nama software duplikat ${data.name}`);
    softwareIds.add(id);
    softwareNames.add(data.name);
    requireText(data.name, `${source} name`);
    requireText(data.monogram, `${source} monogram`);
    requireLocalAsset(data.icon, `${source} icon`, publicRoot, 'assets/software/');
  }

  const publicContent = JSON.stringify({
    projects: published(projects),
    skills: published(skills),
    experience: published(experience),
    education: published(education),
    credentials: published(credentials),
    profile,
  });
  requireCondition(!prohibitedPublicCopy.test(publicContent), 'Copy publik memuat bahasa provenance atau audit yang dilarang');
  if (aboutDraft !== undefined) requireCondition(aboutDraft === true, 'Section lama about harus tetap privat setelah isi digabung ke hero');

  return {
    projects: published(projects).length,
    skills: published(skills).length,
    software: published(software).length,
    experience: published(experience).length,
    education: published(education).length,
    credentials: published(credentials).length,
  };
}
