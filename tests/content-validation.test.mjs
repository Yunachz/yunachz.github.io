import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeProject, validatePortfolioRecords, validateProjectSet, visibleProjects, orderedProjects } from '../scripts/content-validation.mjs';

function fixture(overrides = {}) {
  return {
    slug: 'fixture-project',
    title: 'Fixture project',
    summary: 'Synthetic QA data; never rendered into the site.',
    category: 'QA',
    ...overrides,
  };
}

test('default metadata makes new entries private and unfeatured at order 100', () => {
  const project = normalizeProject(fixture());
  assert.equal(project.draft, true);
  assert.equal(project.featured, false);
  assert.equal(project.order, 100);
});

test('invalid metadata and duplicate slugs fail validation', () => {
  assert.throws(() => normalizeProject(fixture({ slug: 'Not valid' })), /lowercase-kebab-case/);
  assert.throws(() => normalizeProject(fixture({ category: '  ' })), /category/);
  assert.throws(() => validateProjectSet([fixture(), fixture()]), /slug duplikat/);
});

test('drafts stay out of public data and ordering is stable', () => {
  const projects = validateProjectSet([
    fixture({ slug: 'z-project', order: 10, draft: false }),
    fixture({ slug: 'draft-project', order: 1 }),
    fixture({ slug: 'a-project', order: 10, draft: false }),
  ]);
  assert.deepEqual(visibleProjects(projects).map((project) => project.slug), ['z-project', 'a-project']);
  assert.deepEqual(orderedProjects(visibleProjects(projects)).map((project) => project.slug), ['a-project', 'z-project']);
});

test('covers require alt text and a real asset under public/assets/projects', () => {
  const dimensions = { coverWidth: 760, coverHeight: 570 };
  assert.throws(() => normalizeProject(fixture({ cover: 'assets/projects/cover.webp', ...dimensions })), /alt wajib/);
  assert.throws(() => normalizeProject(fixture({ cover: 'assets/projects/cover.webp', alt: 'Cover' })), /coverWidth dan coverHeight wajib/);
  assert.throws(() => validateProjectSet([fixture({ cover: 'assets/projects/missing.webp', alt: 'Cover', ...dimensions })], {
    assetExists: () => false,
  }), /aset cover tidak ditemukan/);
  assert.throws(() => validateProjectSet([fixture({ cover: '../secret.png', alt: 'Cover', ...dimensions })]), /public\/assets\/projects/);
  assert.throws(() => normalizeProject(fixture({ coverWidth: 0 })), /coverWidth harus bilangan bulat positif/);
});

test('profile, contact and CV record validation allow unknown issuer and date to stay absent', () => {
  const profile = { name: 'Fajar', field: 'Electrical Engineering', gpa: 3.72, photo: 'assets/profile/fajar.webp', photoAlt: 'Portrait', photoWidth: 853, photoHeight: 1600 };
  const contact = { github: 'https://github.com/Yunachz', email: 'fajar@example.com', phone: '+6289671216008', whatsapp: 'https://wa.me/6289671216008' };
  const counts = validatePortfolioRecords({
    profile,
    contact,
    credentials: [{ source: 'credentials/example.json', data: { name: 'Listed certificate', draft: false } }],
  });
  assert.deepEqual(counts, { skills: 0, experience: 0, education: 0, credentials: 1 });
  assert.equal('gpaScale' in profile, false);
  assert.equal('issuer' in counts, false);
  assert.throws(() => validatePortfolioRecords({ profile, contact: { ...contact, phone: '89671216008' } }), /format E\.164/);
  assert.throws(() => validatePortfolioRecords({ profile: { ...profile, photoHeight: undefined }, contact }), /photoWidth, dan photoHeight/);
});

for (const size of [1, 3, 10, 30]) {
  test(`QA fixture of ${size} entries stays data-driven`, () => {
    const fixtures = Array.from({ length: size }, (_, index) => fixture({
      slug: `qa-project-${index + 1}`,
      title: `QA project ${index + 1}`,
      order: size - index,
      draft: index % 4 === 0,
      featured: index % 3 === 0,
    }));
    const all = validateProjectSet(fixtures);
    const published = visibleProjects(all);
    assert.equal(all.length, size);
    assert.equal(published.length, size - Math.ceil(size / 4));
    if (published.length) {
      assert.equal(orderedProjects(published)[0].order, Math.min(...published.map((project) => project.order)));
    }
  });
}
