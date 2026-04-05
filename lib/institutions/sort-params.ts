export type SortField = 'name' | 'created_at';
export type SortOrder = 'asc' | 'desc';

export const VALID_SORT_FIELDS: readonly SortField[] = ['name', 'created_at'];
export const VALID_ORDERS: readonly SortOrder[] = ['asc', 'desc'];

const DEFAULT_SORT: SortField = 'name';
const DEFAULT_ORDER: SortOrder = 'asc';

interface RawSortParams {
  sort?: string | string[] | undefined;
  order?: string | string[] | undefined;
}

export interface SortParams {
  sort: SortField;
  order: SortOrder;
}

function isSortField(value: string): value is SortField {
  return (VALID_SORT_FIELDS as readonly string[]).includes(value);
}

function isSortOrder(value: string): value is SortOrder {
  return (VALID_ORDERS as readonly string[]).includes(value);
}

/**
 * URLクエリパラメーターからソートパラメーターを解析する。
 * 不正な値はデフォルト (name / asc) にフォールバックする。
 */
export function parseSortParams(raw: RawSortParams): SortParams {
  const rawSort = Array.isArray(raw.sort) ? raw.sort[0] : raw.sort;
  const rawOrder = Array.isArray(raw.order) ? raw.order[0] : raw.order;

  const sort: SortField =
    rawSort !== undefined && isSortField(rawSort) ? rawSort : DEFAULT_SORT;
  const order: SortOrder =
    rawOrder !== undefined && isSortOrder(rawOrder) ? rawOrder : DEFAULT_ORDER;

  return { sort, order };
}
