import { createServerClient } from '@/lib/supabase/server';
import type { Institution } from '@/lib/types';
import type { SortField, SortOrder } from './sort-params';

export interface RelatedEntity {
  id: string;
  name: string;
}

interface InstitutionRow {
  id: string;
  name: string;
  location: string | null;
  description: string | null;
  contact: string | null;
  created_at: string;
  updated_at: string;
}

function mapRow(row: InstitutionRow): Institution {
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    description: row.description,
    contact: row.contact,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

/**
 * 論理削除済みを除いた研究機関一覧を取得する。
 */
export async function getInstitutions(
  sort: SortField,
  order: SortOrder,
): Promise<Institution[]> {
  const client = createServerClient();
  const { data, error } = await client
    .from('institutions')
    .select('id, name, location, description, contact, created_at, updated_at')
    .is('deleted_at', null)
    .order(sort, { ascending: order === 'asc' });

  if (error) {
    throw new Error(`研究機関の取得に失敗しました: ${error.message}`);
  }

  return (data as InstitutionRow[] | null ?? []).map(mapRow);
}

/**
 * ID で研究機関を 1 件取得する。論理削除済み・未存在の場合は null を返す。
 */
export async function getInstitutionById(
  id: string,
): Promise<Institution | null> {
  const client = createServerClient();
  const { data, error } = await client
    .from('institutions')
    .select('id, name, location, description, contact, created_at, updated_at')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (error) {
    // PGRST116: row not found
    if (error.code === 'PGRST116') return null;
    throw new Error(`研究機関の取得に失敗しました: ${error.message}`);
  }

  return data ? mapRow(data as InstitutionRow) : null;
}

/**
 * 研究機関に関連する研究テーマ一覧を取得する。
 */
export async function getRelatedThemes(
  institutionId: string,
): Promise<RelatedEntity[]> {
  const client = createServerClient();
  const { data, error } = await client
    .from('institution_theme')
    .select('themes(id, name)')
    .eq('institution_id', institutionId);

  if (error) {
    throw new Error(`関連テーマの取得に失敗しました: ${error.message}`);
  }

  return (data ?? [])
    .map((row) => {
      const theme = (row as unknown as { themes: { id: string; name: string } | null })
        .themes;
      return theme ? { id: theme.id, name: theme.name } : null;
    })
    .filter((t): t is RelatedEntity => t !== null);
}

/**
 * 研究機関に関連する投資家一覧を取得する。
 */
export async function getRelatedInvestors(
  institutionId: string,
): Promise<RelatedEntity[]> {
  const client = createServerClient();
  const { data, error } = await client
    .from('institution_investor')
    .select('investors(id, name)')
    .eq('institution_id', institutionId);

  if (error) {
    throw new Error(`関連投資家の取得に失敗しました: ${error.message}`);
  }

  return (data ?? [])
    .map((row) => {
      const investor = (
        row as unknown as { investors: { id: string; name: string } | null }
      ).investors;
      return investor ? { id: investor.id, name: investor.name } : null;
    })
    .filter((i): i is RelatedEntity => i !== null);
}
