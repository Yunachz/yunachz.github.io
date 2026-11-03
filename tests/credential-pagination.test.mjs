import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCredentialDisplayPages, clampPageIndex, paginateRecords } from '../src/lib/credential-pagination.ts';

function fixture(count) {
  return Array.from({ length: count }, (_, index) => `credential-${index + 1}`);
}

test('certificate pages contain six records each and preserve exact row-major membership', () => {
  for (const count of [6, 7, 12, 13]) {
    const records = fixture(count);
    const first = paginateRecords(records, 0);
    const actual = first.pages;

    assert.equal(first.totalPages, Math.ceil(count / 6));
    assert.deepEqual(actual.flat(), records);
    assert.equal(new Set(actual.flat()).size, count);
    assert.ok(actual.every((page) => page.length >= 1 && page.length <= 6));
    assert.ok(actual.slice(0, -1).every((page) => page.length === 6));
    assert.deepEqual(paginateRecords(records, actual.length - 1).items, records.slice(Math.floor((count - 1) / 6) * 6));
  }

  assert.deepEqual(paginateRecords(fixture(7), 0).pages, [fixture(6), fixture(1).map((_, index) => `credential-${index + 7}`)]);
  assert.deepEqual(paginateRecords(fixture(13), 2).items, ['credential-13']);
});

test('certificate pagination clamps stale page state after collection changes', () => {
  assert.equal(clampPageIndex(9, 3), 2);
  assert.equal(clampPageIndex(-4, 3), 0);
  assert.equal(clampPageIndex(Number.NaN, 3), 0);
  assert.equal(clampPageIndex(9, 0), 0);
  assert.deepEqual(paginateRecords([], 9), { items: [], pages: [], pageIndex: 0, totalPages: 0 });
  assert.deepEqual(paginateRecords(fixture(7), 5).items, ['credential-7']);
  assert.deepEqual(paginateRecords(fixture(6), 1).items, ['credential-1', 'credential-2', 'credential-3', 'credential-4', 'credential-5', 'credential-6']);
});

test('certificate pagination rejects invalid page sizes instead of returning phantom pages', () => {
  assert.throws(() => paginateRecords(fixture(3), 0, 0), RangeError);
  assert.throws(() => paginateRecords(fixture(3), 0, 1.5), RangeError);
});

test('display samples stay on their own pages and never consume real credential slots', () => {
  const real = fixture(6);
  const samples = ['layout-sample-1', 'layout-sample-2'];
  const pages = buildCredentialDisplayPages(real, samples);

  assert.deepEqual(pages.map(({ kind, items }) => [kind, items.length]), [['real', 6], ['sample', 2]]);
  assert.deepEqual(pages.flatMap(({ items }) => items.filter((item) => item.kind === 'real').map((item) => item.entry)), real);
  assert.deepEqual(pages.flatMap(({ items }) => items.filter((item) => item.kind === 'sample').map((item) => item.entry)), samples);

  const withFutureCredential = buildCredentialDisplayPages(fixture(7), samples);
  assert.deepEqual(withFutureCredential.map(({ kind, items }) => [kind, items.length]), [
    ['real', 6],
    ['real', 1],
    ['sample', 2],
  ]);
  assert.deepEqual(buildCredentialDisplayPages(real, []).map(({ items }) => items.length), [6]);
  assert.deepEqual(buildCredentialDisplayPages([], []), []);
});
