import test from 'node:test';
import assert from 'node:assert/strict';
import { loadV3Content, validateV3Content } from '../scripts/v3-content-validation.mjs';
import { categoryLabelForProject } from '../src/lib/project-categories.ts';

const root = process.cwd();
const source = await loadV3Content(root);

function cloneSource() {
  return structuredClone(source);
}

test('project cards resolve localized category labels directly from the registry', () => {
  const registry = [
    { id: 'plc', label: { id: 'Sistem PLC', en: 'PLC Systems' }, order: 30 },
    { id: 'iot', label: { id: 'IoT', en: 'IoT' }, order: 10 },
  ];
  assert.deepEqual(categoryLabelForProject(['plc', 'iot'], registry), {
    id: 'IoT · Sistem PLC',
    en: 'IoT · PLC Systems',
  });
});

test('generic validator accepts authorized content growth and registry-backed categories', () => {
  const snapshot = cloneSource();
  snapshot.categoryRegistry.push({
    id: 'industrial-automation',
    label: { id: 'Otomasi Industri', en: 'Industrial Automation' },
    order: 50,
  });

  const project = structuredClone(snapshot.projects.find(({ data }) => data.draft === false));
  project.source = 'fixture:future-project';
  project.data.slug = 'future-control-project';
  project.data.categoryIds = ['industrial-automation'];
  delete project.data.categoryLabel;
  project.data.title = 'Future Control Project';
  snapshot.projects.push(project);

  const skill = structuredClone(snapshot.skills.find(({ data }) => data.draft === false));
  skill.source = 'fixture:future-skill';
  skill.id = 'future-control-skill';
  skill.data.projectSlugs = ['future-control-project'];
  snapshot.skills.push(skill);
  const programmingGroup = snapshot.skillGroups.find(({ id }) => id === 'programming-data');
  if (!programmingGroup) throw new Error('Programming group fixture is missing.');
  programmingGroup.data.skillIds.push('future-control-skill');
  programmingGroup.data.chips.push({
    label: { id: 'Kemampuan baru', en: 'New capability' },
    skillIds: ['future-control-skill'],
  });

  const experience = structuredClone(snapshot.experience.find(({ data }) => data.draft === false));
  experience.source = 'fixture:future-experience';
  experience.id = 'future-experience';
  snapshot.experience.push(experience);

  const software = structuredClone(snapshot.software[0]);
  software.source = 'fixture:future-software';
  software.id = 'future-software';
  software.data.name = 'Authorized Design Tool';
  software.data.monogram = 'ADT';
  software.data.order = 99;
  snapshot.software.push(software);

  const credential = structuredClone(snapshot.credentials[0]);
  credential.source = 'fixture:future-credential';
  credential.id = 'future-credential';
  credential.data.issuer = 'Authorized issuer';
  credential.data.issuedAt = '2026-01';
  credential.data.verifyUrl = 'https://example.com/credential';
  credential.data.document = 'assets/documents/cv-muhammad-fajar-sodik.pdf';
  snapshot.credentials.push(credential);

  assert.equal(validateV3Content(snapshot).projects, source.projects.filter(({ data }) => data.draft === false).length + 1);
});

test('education logos are optional, local image assets with positive intrinsic dimensions', () => {
  const snapshot = cloneSource();
  const upnvj = snapshot.education.find(({ id }) => id === 'upnvj');
  assert.deepEqual(upnvj?.data.logo, {
    src: 'assets/education/upnvj.png',
    width: 520,
    height: 520,
  });
  assert.equal(validateV3Content(snapshot).education, source.education.filter(({ data }) => data.draft === false).length);

  const invalid = cloneSource();
  const entry = invalid.education.find(({ id }) => id === 'upnvj');
  if (!entry) throw new Error('UPNVJ fixture is missing.');
  entry.data.logo.width = 0;
  assert.throws(() => validateV3Content(invalid), /logo memerlukan dimensi positif/);

  const external = cloneSource();
  const externalEntry = external.education.find(({ id }) => id === 'upnvj');
  if (!externalEntry) throw new Error('UPNVJ fixture is missing.');
  externalEntry.data.logo.src = 'https://example.com/logo.png';
  assert.throws(() => validateV3Content(external), /logo.src harus berada di public\/assets/);
});

test('sample layout cards validate separately and do not change the six credential count', () => {
  const snapshot = cloneSource();
  assert.equal(snapshot.credentialSamples.filter(({ data }) => data.draft === false).length, 2);
  assert.equal(validateV3Content(snapshot).credentials, 6);

  const withoutSamples = cloneSource();
  withoutSamples.credentialSamples = [];
  assert.equal(validateV3Content(withoutSamples).credentials, 6);

  const fabricated = cloneSource();
  const sample = fabricated.credentialSamples[0];
  if (!sample) throw new Error('Sample layout fixture is missing.');
  sample.data.issuer = 'Fabricated issuer';
  assert.throws(() => validateV3Content(fabricated), /sample tidak boleh memuat issuer/);
});

test('four published dummy competition records are localized, labelled, and use three local placeholders', () => {
  const snapshot = cloneSource();
  const counts = validateV3Content(snapshot);
  const dummyRecords = snapshot.competitions.filter(({ data }) => data.isDummy && data.draft === false);
  assert.equal(dummyRecords.length, 4);
  assert.equal(counts.competitions, 4);
  assert.deepEqual(dummyRecords.map(({ id }) => id).sort(), [
    'example-automation', 'example-control', 'example-iot', 'example-robotics',
  ]);
  for (const { data } of dummyRecords) {
    assert.equal(data.photos.length, 3);
    for (const locale of ['id', 'en']) {
      assert.ok(data.copy[locale].title);
      assert.ok(data.copy[locale].status);
      assert.ok(data.copy[locale].description);
    }
    assert.ok(data.photos.every((photo) => photo.kind === 'placeholder' && photo.src.startsWith('assets/placeholders/')));
  }
});

test('competition content rejects missing localized status, external media, and missing dummy examples', () => {
  const missingStatus = cloneSource();
  const first = missingStatus.competitions.find(({ id }) => id === 'example-automation');
  if (!first) throw new Error('Automation example fixture is missing.');
  first.data.copy.en.status = ' ';
  assert.throws(() => validateV3Content(missingStatus), /copy\.en\.status wajib berisi teks/);

  const externalPhoto = cloneSource();
  const record = externalPhoto.competitions.find(({ id }) => id === 'example-iot');
  if (!record) throw new Error('IoT example fixture is missing.');
  record.data.photos[0].src = 'https://example.com/photo.jpg';
  assert.throws(() => validateV3Content(externalPhoto), /photos\[0\] media\.src harus berada di public\/assets\//);

  const missingExample = cloneSource();
  missingExample.competitions = missingExample.competitions.filter(({ id }) => id !== 'example-control');
  assert.throws(() => validateV3Content(missingExample), /tepat empat contoh kompetisi dummy/);
});

test('skill group registry rejects duplicate, unmapped, and unknown canonical skill references', () => {
  const duplicated = cloneSource();
  const secondGroup = duplicated.skillGroups.find(({ id }) => id === 'embedded-electronics');
  if (!secondGroup) throw new Error('Embedded group fixture is missing.');
  secondGroup.data.skillIds.push('electrical-engineering');
  assert.throws(() => validateV3Content(duplicated), /sudah dipetakan di grup lain/);

  const unmapped = cloneSource();
  const electrical = unmapped.skillGroups.find(({ id }) => id === 'electrical-control');
  if (!electrical) throw new Error('Electrical group fixture is missing.');
  electrical.data.skillIds = electrical.data.skillIds.filter((id) => id !== 'plc');
  electrical.data.chips = electrical.data.chips.filter((chip) => !chip.skillIds.includes('plc'));
  assert.throws(() => validateV3Content(unmapped), /Skill terbit plc belum dipetakan/);

  const unknown = cloneSource();
  const programming = unknown.skillGroups.find(({ id }) => id === 'programming-data');
  if (!programming) throw new Error('Programming group fixture is missing.');
  programming.data.chips[0].skillIds[0] = 'unrecorded-cpp';
  assert.throws(() => validateV3Content(unknown), /merujuk skill di luar grup unrecorded-cpp/);
});

test('generic validator rejects unknown project categories and published references to drafts', () => {
  const unknownCategory = cloneSource();
  const project = structuredClone(unknownCategory.projects[0]);
  project.source = 'fixture:unknown-category';
  project.data.slug = 'unknown-category-project';
  project.data.categoryIds = ['not-registered'];
  unknownCategory.projects.push(project);
  assert.throws(() => validateV3Content(unknownCategory), /kategori tidak terdaftar/);

  const draftReference = cloneSource();
  const draftProject = structuredClone(draftReference.projects[0]);
  draftProject.source = 'fixture:draft-project';
  draftProject.data.slug = 'draft-only-project';
  draftProject.data.draft = true;
  draftReference.projects.push(draftProject);
  const skill = structuredClone(draftReference.skills.find(({ data }) => data.draft === false));
  skill.source = 'fixture:published-skill';
  skill.id = 'published-skill';
  skill.data.projectSlugs = ['draft-only-project'];
  assert.throws(() => validateV3Content({ ...draftReference, skills: [...draftReference.skills, skill] }), /proyek draft tidak dapat dirujuk/);
});

test('generic validator rejects mismatched bilingual project and experience arrays', () => {
  const projectMismatch = cloneSource();
  const project = structuredClone(projectMismatch.projects[0]);
  project.source = 'fixture:mismatched-project';
  project.data.slug = 'mismatched-project';
  project.data.copy.en.paragraphs.push('An unmatched translation.');
  projectMismatch.projects.push(project);
  assert.throws(() => validateV3Content(projectMismatch), /paragraf ID dan EN harus sama/);

  const experienceMismatch = cloneSource();
  const experience = structuredClone(experienceMismatch.experience[0]);
  experience.source = 'fixture:mismatched-experience';
  experience.id = 'mismatched-experience';
  experience.data.copy.en.details.push('An unmatched translation.');
  experienceMismatch.experience.push(experience);
  assert.throws(() => validateV3Content(experienceMismatch), /detail ID dan EN harus sama/);
});
