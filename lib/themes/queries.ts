import { createServerClient } from '@/lib/supabase/server';
import type { Theme, ThemeStatus } from '@/lib/types';
import type { ThemeSortField, SortOrder } from './query-params';

export interface RelatedEntity {
  id: string;
  name: string;
}

interface ThemeRow {
  id: string;
  name: string;
  description: string | null;
  status: string;
  start_date: string | null;
  created_at: string;
  updated_at: string;
}

function mapRow(row: ThemeRow): Theme {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    status: row.status as ThemeStatus,
    startDate: row.start_date,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

/**
 * 論理削除済みを除いた研究テーマ一覧を取得する。
 * status を指定した場合はそのステータスのみ返す。
 */
export async function getThemes(
  sort: ThemeSortField,
  order: SortOrder,
  status?: ThemeStatus,
): Promise<Theme[]> {
  const client = createServerClient();
  let query = client
    .from('themes')
    .select('id, name, description, status, start_date, created_at, updated_at')
    .is('deleted_at', null)
    .order(sort, { ascending: order === 'asc' });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`研究テーマの取得に失敗しました: ${error.message}`);
  }

  return (data as ThemeRow[] | null ?? []).map(mapRow);
}

/** ID で研究テーマを 1 件取得する。論理削除済み・未存在は null を返す。 */
export async function getThemeById(id: string): Promise<Theme | null> {
  const client = createServerClient();
  const { data, error } = await client
    .from('themes')
    .select('id, name, description, status, start_date, created_at, updated_at')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`研究テーマの取得に失敗しました: ${error.message}`);
  }

  return data ? mapRow(data as ThemeRow) : null;
}

/** テーマに関連する研究機関一覧を取得する。 */
export async function getRelatedInstitutions(
  themeId: string,
): Promise<RelatedEntity[]> {
  const client = createServerClient();
  const { data, error } = await client
    .from('institution_theme')
    .select('institutions(id, name)')
    .eq('theme_id', themeId);

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

/** テーマに関連する投資家一覧を取得する。 */
export async function getRelatedInvestors(
  themeId: string,
): Promise<RelatedEntity[]> {
  const client = createServerClient();
  const { data, error } = await client
    .from('theme_investor')
    .select('investors(id, name)')
    .eq('theme_id', themeId);

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
