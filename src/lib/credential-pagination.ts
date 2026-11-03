export const CREDENTIAL_PAGE_SIZE = 6;

export function chunkRecords<T>(records: readonly T[], pageSize = CREDENTIAL_PAGE_SIZE): T[][] {
  if (!Number.isInteger(pageSize) || pageSize < 1) {
    throw new RangeError('Page size must be a positive integer.');
  }

  const pages: T[][] = [];
  for (let offset = 0; offset < records.length; offset += pageSize) {
    pages.push(records.slice(offset, offset + pageSize));
  }
  return pages;
}

export function clampPageIndex(pageIndex: number, totalPages: number): number {
  if (totalPages < 1) return 0;
  const integerIndex = Number.isFinite(pageIndex) ? Math.trunc(pageIndex) : 0;
  return Math.min(Math.max(integerIndex, 0), totalPages - 1);
}

export function paginateRecords<T>(
  records: readonly T[],
  pageIndex: number,
  pageSize = CREDENTIAL_PAGE_SIZE,
) {
  const pages = chunkRecords(records, pageSize);
  const resolvedPageIndex = clampPageIndex(pageIndex, pages.length);
  return {
    items: pages[resolvedPageIndex] ?? [],
    pages,
    pageIndex: resolvedPageIndex,
    totalPages: pages.length,
  };
}
