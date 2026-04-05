import { createServerClient } from '@/lib/supabase/server';
import type { Investor, InvestorType } from '@/lib/types';
import type { InvestorSortField, SortOrder } from './query-params';

export interface RelatedEntity {
  id: string;
  name: string;
}

interface InvestorRow {
  id: string;
  name: string;
  investor_type: string;
  contact: string | null;
  investment_field: string | null;
  created_at: string;
  updated_at: string;
}

function mapRow(row: InvestorRow): Investor {
  return {
    id: row.id,
    name: row.name,
    investorType: row.investor_type as InvestorType,
    contact: row.contact,
    investmentField: row.investment_field,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

/** 論理削除済みを除いた投資家一覧を取得する。 */
export async function getInvestors(
  sort: InvestorSortField,
  order: SortOrder,
  investorType?: InvestorType,
): Promise<Investor[]> {
  const client = createServerClient();
  let query = client
    .from('investors')
    .select(
      'id, name, investor_type, contact, investment_field, created_at, updated_at',
    )
    .is('deleted_at', null)
    .order(sort, { ascending: order === 'asc' });

  if (investorType) {
    query = query.eq('investor_type', investorType);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`投資家の取得に失敗しました: ${error.message}`);
  }

  return (data as InvestorRow[] | null ?? []).map(mapRow);
}

/** ID で投資家を 1 件取得する。論理削除済み・未存在は null を返す。 */
export async function getInvestorById(id: string): Promise<Investor | null> {
  const client = createServerClient();
  const { data, error } = await client
    .from('investors')
    .select(
      'id, name, investor_type, contact, investment_field, created_at, updated_at',
    )
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`投資家の取得に失敗しました: ${error.message}`);
  }

  return data ? mapRow(data as InvestorRow) : null;
}

/** 投資家に関連する研究機関一覧を取得する。 */
export async function getRelatedInstitutions(
  investorId: string,
): Promise<RelatedEntity[]> {
  const client = createServerClient();
  const { data, error } = await client
    .from('institution_investor')
    .select('institutions(id, name)')
    .eq('investor_id', investorId);

  if (error) {
    throw new Error(`関連研究機関の取得に失敗しました: ${error.message}`);
  }

  return (data ?? [])
    .map((row) => {
      const inst = (
        row as unknown as { institutions: { id: string; name: string } | null }
      ).institutions;
      return inst ? { id: inst.id, name: inst.name } : null;
    })
    .filter((i): i is RelatedEntity => i !== null);
}

/** 投資家に関連する研究テーマ一覧を取得する。 */
export async function getRelatedThemes(
  investorId: string,
): Promise<RelatedEntity[]> {
  const client = createServerClient();
  const { data, error } = await client
    .from('theme_investor')
    .select('themes(id, name)')
    .eq('investor_id', investorId);

  if (error) {
    throw new Error(`関連テーマの取得に失敗しました: ${error.message}`);
  }

  return (data ?? [])
    .map((row) => {
      const theme = (
        row as unknown as { themes: { id: string; name: string } | null }
      ).themes;
      return theme ? { id: theme.id, name: theme.name } : null;
    })
    .filter((t): t is RelatedEntity => t !== null);
}
