import type { EntityType } from '@/lib/types';

/** エンティティタイプ → 中間テーブルのカラム名 */
export const TYPE_TO_COL: Record<EntityType, string> = {
  institution: 'institution_id',
  theme: 'theme_id',
  investor: 'investor_id',
};

type JunctionTableName =
  | 'institution_theme'
  | 'institution_investor'
  | 'theme_investor';

const JUNCTION_TABLE: Record<string, JunctionTableName> = {
  'institution-theme': 'institution_theme',
  'theme-institution': 'institution_theme',
  'institution-investor': 'institution_investor',
  'investor-institution': 'institution_investor',
  'theme-investor': 'theme_investor',
  'investor-theme': 'theme_investor',
};

/**
 * 2つのエンティティタイプに対応する中間テーブル名を返す。
 * 同一タイプどうし、または対応テーブルがない場合は null を返す。
 */
export function getJunctionTable(
  typeA: EntityType,
  typeB: EntityType,
): JunctionTableName | null {
  return JUNCTION_TABLE[`${typeA}-${typeB}`] ?? null;
}
