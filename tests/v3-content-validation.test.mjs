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
