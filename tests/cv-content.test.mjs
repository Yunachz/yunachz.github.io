import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const baseline = {
  projects: ['lora-sentinel', 'aquasync-ph-stabilizer', 'smart-trash-bin', 'fuzzy-fire-suppression', 'kafe-kekinian-pos'],
  skills: ['python', 'proteus-pcb-learning', 'editing', 'plc', 'machine-learning-learning', 'electrical-engineering', 'electrical-installations', 'embedded-learning', 'electrical-diagrams', 'circuit-analysis'],
  experience: ['startup-101', 'seminar-mosfet', 'ksm-mekatronika', 'electrical-competition', 'electrician-gathering', 'synergy-fest', 'aston-ojt', 'hari-listrik-webinar', 'ksm-iot'],
  education: ['smkn-5-jakarta', 'upnvj', 'electrical-training-2023', 'kemala-bhayangkari'],
  software: ['MATLAB', 'Arduino IDE', 'STM32Cube', 'Altium', 'Fusion', 'Proteus', 'TIA Portal'],
  credentials: [
    'Middle Implementer of Maintenance of PLC Based Control Instruments (BNSP)',
    'Sertifikat Kompetensi LSK PPSDM KEBTKE',
    'ASTON Kemayoran City Hotel On The Job Training',
    'Data Analytics (Pearson IT Specialist)',
    'IC3 Digital Literacy Global Standard 6 Level 1',
    'Pelatihan Peningkatan Kompetensi Peserta Didik SMK Bidang Keahlian Teknik Kelistrikan Angkatan I Tahun 2023',
  ],
};
const baselineExperience = new Set(baseline.experience);

async function readJsonCollection(name) {
  const directory = path.join(root, 'src/content', name);
  const files = (await readdir(directory)).filter((file) => file.endsWith('.json')).sort();
  return Promise.all(files.map(async (file) => ({
    id: file.replace(/\.json$/, ''),
    data: JSON.parse(await readFile(path.join(directory, file), 'utf8')),
  })));
}

async function readProjects() {
  const directory = path.join(root, 'src/content/projects');
  const files = (await readdir(directory)).filter((file) => file.endsWith('.md')).sort();
  return Promise.all(files.map(async (file) => ({
    id: file.replace(/\.md$/, ''),
    data: matter(await readFile(path.join(directory, file), 'utf8')).data,
  })));
}

function assertSubset(required, records, label) {
  const actual = new Set(records);
  for (const id of required) assert.ok(actual.has(id), label + ' preserves ' + id);
}

test('V3 keeps every audited baseline collection record without freezing growth', async () => {
  const projects = await readProjects();
  const skills = await readJsonCollection('skills');
  const software = await readJsonCollection('software');
  const experience = await readJsonCollection('experience');
  const education = await readJsonCollection('education');
  const credentials = await readJsonCollection('credentials');

  assertSubset(baseline.projects, projects.map(({ data }) => data.slug), 'projects');
  assertSubset(baseline.skills, skills.map(({ id }) => id), 'skills');
  assertSubset(baseline.experience, experience.map(({ id }) => id), 'experience');
  assertSubset(baseline.education, education.map(({ id }) => id), 'education');
  assertSubset(baseline.software, software.map(({ data }) => data.name), 'software');
  assertSubset(baseline.credentials, credentials.map(({ data }) => data.name), 'credentials');

  const initialProjects = projects.filter(({ data }) => baseline.projects.includes(data.slug));
  const categories = JSON.parse(await readFile(path.join(root, 'src/lib/project-categories.json'), 'utf8'));
  const categoryIds = new Set(categories.map(({ id }) => id));
  for (const { data } of initialProjects) {
    assert.equal(data.draft, false);
    assert.ok(data.categoryIds.length > 0);
    assert.ok(data.categoryIds.every((id) => categoryIds.has(id)));
    assert.equal(data.copy.id.paragraphs.length, data.copy.en.paragraphs.length);
  }
  for (const { id, data } of experience.filter(({ id }) => baselineExperience.has(id))) {
    assert.equal(data.draft, false, id);
    assert.equal(data.copy.id.details.length, data.copy.en.details.length, id);
  }
  assert.deepEqual(
    experience.filter(({ id }) => baselineExperience.has(id)).reduce((totals, { data }) => ({
      id: totals.id + data.copy.id.details.length,
      en: totals.en + data.copy.en.details.length,
    }), { id: 0, en: 0 }),
    { id: 24, en: 24 },
  );
  assert.ok(education.filter(({ id }) => baseline.education.includes(id)).every(({ data }) => data.draft === false));
});

test('profile, contact, CV, portrait and project photographs retain their supplied facts and assets', async () => {
  const profile = JSON.parse(await readFile(path.join(root, 'src/content/site/profile.json'), 'utf8'));
  const contact = JSON.parse(await readFile(path.join(root, 'src/content/site/contact.json'), 'utf8'));

  assert.equal(profile.name, 'Muhammad Fajar Sodik');
  assert.equal(profile.gpa, 3.72);
  assert.equal(profile.location, 'Jakarta, Indonesia');
  assert.match(profile.copy.id.field, /Teknik Elektro/);
  assert.match(profile.copy.en.field, /Electrical Engineering/);
  assert.match(profile.copy.en.field, /student/i);
  assert.deepEqual(profile.languages.map(({ name, level }) => [name.en, level.en]), [['Indonesian', 'Native'], ['English', 'Basic']]);
  assert.equal(profile.photo, 'assets/profile/muhammad-fajar-sodik.webp');
  assert.equal(profile.photoWidth, 853);
  assert.equal(profile.photoHeight, 1600);
  assert.equal(profile.cv, 'assets/documents/cv-muhammad-fajar-sodik.pdf');
  assert.equal(profile.cvByLocale.en, profile.cv);
  assert.notEqual(profile.cvByLocale.id, profile.cvByLocale.en);
  assert.doesNotMatch(JSON.stringify(profile), /3\.72\s*\/\s*4|semester|graduat(ed|ion)/i);
  assert.deepEqual(contact, {
    kind: 'contact',
    github: 'https://github.com/Yunachz',
    linkedin: 'https://www.linkedin.com/in/muhammadfajarsodik',
    whatsapp: 'https://wa.me/6289671216008',
    phone: '+6289671216008',
    email: 'mfajarsodik.work@gmail.com',
  });

  for (const asset of [profile.photo, profile.cv, profile.cvByLocale.id]) {
    const details = await stat(path.join(root, 'public', asset));
    assert.ok(details.isFile() && details.size > 0, asset + ' must be a real local asset');
  }
  for (const asset of [
    'public/assets/projects/fuzzy-fire-suppression.webp',
    'public/assets/projects/aquasync-ph-stabilizer.webp',
    'public/assets/projects/lora-sentinel.webp',
    'public/assets/projects/smart-trash-bin.webp',
  ]) await access(path.join(root, asset));
});

test('the six audited certificate names retain no unsupported issuer, date, verification URL or scan', async () => {
  const credentials = await readJsonCollection('credentials');
  for (const name of baseline.credentials) {
    const credential = credentials.find(({ data }) => data.name === name)?.data;
    assert.ok(credential, name);
    assert.equal(credential.issuer, undefined, name);
    assert.equal(credential.issuedAt, undefined, name);
    assert.equal(credential.verifyUrl, undefined, name);
    assert.equal(credential.document, undefined, name);
  }
});

test('published bilingual copy avoids provenance language and preserves authorized software names', async () => {
  const collections = ['skills', 'experience', 'education', 'credentials'];
  const content = [];
  for (const name of collections) {
    for (const { data } of await readJsonCollection(name)) if (data.draft === false) content.push(data);
  }
  content.push(...(await readProjects()).filter(({ data }) => data.draft === false).map(({ data }) => data));
  const serialized = JSON.stringify(content);
  assert.doesNotMatch(serialized, /tercantum pada CV|telah diverifikasi|documentation audit|project verification/i);
  const software = (await readJsonCollection('software')).map(({ data }) => data.name);
  assertSubset(baseline.software, software, 'software');
  const about = await readFile(path.join(root, 'src/content/sections/about.md'), 'utf8');
  assert.match(about, /draft:\s*true/);
});
