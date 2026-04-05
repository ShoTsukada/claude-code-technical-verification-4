import type { CommentCategory } from '@/lib/types';

const VALID_CATEGORIES: readonly CommentCategory[] = [
  'improvement',
  'bug',
  'other',
];

interface RawQueryParams {
  [key: string]: string | string[] | undefined;
}

export interface DashboardParams {
  pageId: string | undefined;
  category: CommentCategory | undefined;
  dateFrom: string | undefined;
  dateTo: string | undefined;
  page: number;
}

function resolveScalar(v: string | string[] | undefined): string | undefined {
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

function isCommentCategory(v: string): v is CommentCategory {
  return (VALID_CATEGORIES as readonly string[]).includes(v);
}

/**
 * URLクエリパラメーターからダッシュボードのフィルター条件を解析する。
 * 不正値はデフォルトにフォールバックする。
 */
export function parseDashboardParams(raw: RawQueryParams): DashboardParams {
  const rawPageId = resolveScalar(raw.pageId);
  const rawCategory = resolveScalar(raw.category);
  const rawDateFrom = resolveScalar(raw.dateFrom);
  const rawDateTo = resolveScalar(raw.dateTo);
  const rawPage = resolveScalar(raw.page);

  const pageId =
    rawPageId && rawPageId.trim() !== '' ? rawPageId.trim() : undefined;

  const category =
    rawCategory && isCommentCategory(rawCategory) ? rawCategory : undefined;

  const dateFrom = rawDateFrom && rawDateFrom.trim() !== '' ? rawDateFrom : undefined;
  const dateTo = rawDateTo && rawDateTo.trim() !== '' ? rawDateTo : undefined;

  const pageNum = rawPage ? parseInt(rawPage, 10) : NaN;
  const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;

  return { pageId, category, dateFrom, dateTo, page };
}
