import type { InvestorType } from '@/lib/types';

export type InvestorSortField = 'name' | 'created_at';
export type SortOrder = 'asc' | 'desc';

export const VALID_INVESTOR_SORT_FIELDS: readonly InvestorSortField[] = [
  'name',
  'created_at',
];
export const VALID_ORDERS: readonly SortOrder[] = ['asc', 'desc'];
export const VALID_INVESTOR_TYPES: readonly InvestorType[] = [
  'individual',
  'corporate',
];

const DEFAULT_SORT: InvestorSortField = 'name';
const DEFAULT_ORDER: SortOrder = 'asc';

interface RawQueryParams {
  sort?: string | string[] | undefined;
  order?: string | string[] | undefined;
  investorType?: string | string[] | undefined;
}

export interface InvestorQueryParams {
  sort: InvestorSortField;
  order: SortOrder;
  /** undefined = 全種別表示 */
  investorType: InvestorType | undefined;
}

function resolveScalar(v: string | string[] | undefined): string | undefined {
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

function isInvestorSortField(v: string): v is InvestorSortField {
  return (VALID_INVESTOR_SORT_FIELDS as readonly string[]).includes(v);
}

function isSortOrder(v: string): v is SortOrder {
  return (VALID_ORDERS as readonly string[]).includes(v);
}

function isInvestorType(v: string): v is InvestorType {
  return (VALID_INVESTOR_TYPES as readonly string[]).includes(v);
}

/**
 * URLクエリパラメーターから投資家一覧のソート・フィルター条件を解析する。
 * 不正値はデフォルトにフォールバックする。
 */
export function parseInvestorQueryParams(
  raw: RawQueryParams,
): InvestorQueryParams {
  const rawSort = resolveScalar(raw.sort);
  const rawOrder = resolveScalar(raw.order);
  const rawType = resolveScalar(raw.investorType);

  const sort: InvestorSortField =
    rawSort && isInvestorSortField(rawSort) ? rawSort : DEFAULT_SORT;
  const order: SortOrder =
    rawOrder && isSortOrder(rawOrder) ? rawOrder : DEFAULT_ORDER;
  const investorType: InvestorType | undefined =
    rawType && isInvestorType(rawType) ? rawType : undefined;

  return { sort, order, investorType };
}
