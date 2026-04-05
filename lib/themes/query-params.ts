import type { ThemeStatus } from '@/lib/types';

export type ThemeSortField = 'name' | 'created_at';
export type SortOrder = 'asc' | 'desc';

export const VALID_THEME_SORT_FIELDS: readonly ThemeSortField[] = [
  'name',
  'created_at',
];
export const VALID_ORDERS: readonly SortOrder[] = ['asc', 'desc'];
export const VALID_STATUSES: readonly ThemeStatus[] = [
  'active',
  'completed',
  'pending',
];

const DEFAULT_SORT: ThemeSortField = 'name';
const DEFAULT_ORDER: SortOrder = 'asc';

interface RawQueryParams {
  sort?: string | string[] | undefined;
  order?: string | string[] | undefined;
  status?: string | string[] | undefined;
}

export interface ThemeQueryParams {
  sort: ThemeSortField;
  order: SortOrder;
  /** undefined = 全ステータス表示 */
  status: ThemeStatus | undefined;
}

function resolveScalar(
  value: string | string[] | undefined,
): string | undefined {
  if (value === undefined) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function isThemeSortField(v: string): v is ThemeSortField {
  return (VALID_THEME_SORT_FIELDS as readonly string[]).includes(v);
}

function isSortOrder(v: string): v is SortOrder {
  return (VALID_ORDERS as readonly string[]).includes(v);
}

function isThemeStatus(v: string): v is ThemeStatus {
  return (VALID_STATUSES as readonly string[]).includes(v);
}

/**
 * URLクエリパラメーターから研究テーマ一覧のソート・フィルター条件を解析する。
 * 不正値はデフォルトにフォールバックする。
 */
export function parseThemeQueryParams(raw: RawQueryParams): ThemeQueryParams {
  const rawSort = resolveScalar(raw.sort);
  const rawOrder = resolveScalar(raw.order);
  const rawStatus = resolveScalar(raw.status);

  const sort: ThemeSortField =
    rawSort && isThemeSortField(rawSort) ? rawSort : DEFAULT_SORT;
  const order: SortOrder =
    rawOrder && isSortOrder(rawOrder) ? rawOrder : DEFAULT_ORDER;
  const status: ThemeStatus | undefined =
    rawStatus && isThemeStatus(rawStatus) ? rawStatus : undefined;

  return { sort, order, status };
}
