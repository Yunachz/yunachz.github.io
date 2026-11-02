import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();

async function readCollection(name) {
  const directory = path.join(root, 'src/content', name);
  const files = (await readdir(directory)).filter((file) => file.endsWith('.json')).sort();
  return Promise.all(files.map(async (file) => ({
    id: file.replace(/\.json$/, ''),
    ...JSON.parse(await readFile(path.join(directory, file), 'utf8')),
  })));
}

test('CV-derived collections contain the audited records with full detail entries', async () => {
  const skills = await readCollection('skills');
  const experience = await readCollection('experience');
  const education = await readCollection('education');
  const credentials = await readCollection('credentials');

  assert.equal(skills.length, 10);
  assert.equal(experience.length, 9);
  assert.equal(experience.filter((entry) => entry.category === 'OJT').length, 1);
  assert.equal(experience.filter((entry) => entry.category === 'Organisasi').length, 2);
  assert.equal(experience.filter((entry) => entry.category === 'Kepanitiaan').length, 6);
  assert.equal(education.filter((entry) => entry.category === 'Pendidikan formal').length, 3);
  assert.equal(education.filter((entry) => entry.category === 'Pelatihan nonformal').length, 1);
  assert.equal(credentials.length, 6);
  assert.ok(experience.every((entry) => entry.draft === false && entry.details.length > 0));
  assert.ok(education.every((entry) => entry.draft === false));
  assert.ok(credentials.every((entry) => entry.draft === false && entry.sourcePage === 3));
  assert.equal(education.find((entry) => entry.category === 'Pelatihan nonformal')?.institution, 'Pusat Pelatihan dan Pengembangan Pendidikan Jakarta Timur');
});

test('CV facts, user contacts, portrait and PDF use the supplied assets and values', async () => {
  const profile = JSON.parse(await readFile(path.join(root, 'src/content/site/profile.json'), 'utf8'));
  const contact = JSON.parse(await readFile(path.join(root, 'src/content/site/contact.json'), 'utf8'));

  assert.equal(profile.gpa, 3.72);
  assert.equal(profile.location, 'Jakarta, Indonesia');
  assert.equal(profile.photo, 'assets/profile/muhammad-fajar-sodik.webp');
  assert.equal(profile.photoWidth, 853);
  assert.equal(profile.photoHeight, 1600);
  assert.equal(profile.cv, 'assets/documents/cv-muhammad-fajar-sodik.pdf');
  assert.deepEqual(contact, {
    kind: 'contact',
    github: 'https://github.com/Yunachz',
    linkedin: 'https://www.linkedin.com/in/muhammadfajarsodik',
    whatsapp: 'https://wa.me/6289671216008',
    phone: '+6289671216008',
    email: 'mfajarsodik.work@gmail.com',
  });

  for (const asset of [profile.photo, profile.cv]) {
    const details = await stat(path.join(root, 'public', asset));
    assert.ok(details.isFile() && details.size > 0, `${asset} must be a real local asset`);
  }
  await access(path.join(root, 'public/assets/projects/fuzzy-fire-suppression.webp'));
  await access(path.join(root, 'public/assets/projects/aquasync-ph-stabilizer.webp'));
  await access(path.join(root, 'public/assets/projects/lora-sentinel.webp'));
  await access(path.join(root, 'public/assets/projects/smart-trash-bin.webp'));
});

test('CV-listed credentials do not invent issuer, issue date, verification URL, or certificate scans', async () => {
  const credentials = await readCollection('credentials');
  for (const credential of credentials) {
    assert.equal(credential.issuer, undefined);
    assert.equal(credential.issuedAt, undefined);
    assert.equal(credential.verifyUrl, undefined);
    assert.equal(credential.document, undefined);
  }
  assert.deepEqual(new Set(credentials.map((entry) => entry.name)), new Set([
    'Middle Implementer of Maintenance of PLC Based Control Instruments (BNSP)',
    'Sertifikat Kompetensi LSK PPSDM KEBTKE',
    'ASTON Kemayoran City Hotel On The Job Training',
    'Data Analytics (Pearson IT Specialist)',
    'IC3 Digital Literacy Global Standard 6 Level 1',
    'Pelatihan Peningkatan Kompetensi Peserta Didik SMK Bidang Keahlian Teknik Kelistrikan Angkatan I Tahun 2023',
  ]));
});

test('profile narrative and skills contain only audited CV facts', async () => {
  const about = await readFile(path.join(root, 'src/content/sections/about.md'), 'utf8');
  const skills = await readCollection('skills');
  const facts = JSON.stringify({ about, skills });
  assert.match(about, /Universitas Pembangunan Nasional Veteran Jakarta/);
  assert.match(facts, /Proteus/);
  assert.match(facts, /mikrokontroler/);
  assert.doesNotMatch(facts, /genset|boiler|3\s*fasa|maintenance.?log\s*20|akreditasi\s*6|credential.?id/i);
});
