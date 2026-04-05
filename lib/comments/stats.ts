import type { CommentCategory } from '@/lib/types';

export interface CategoryStat {
  category: CommentCategory;
  label: string;
  count: number;
}

const CATEGORY_CONFIG: Array<{ category: CommentCategory; label: string }> = [
  { category: 'improvement', label: '改善要望' },
  { category: 'bug', label: '不具合' },
  { category: 'other', label: 'その他' },
];

/**
 * カテゴリーごとのコメント件数を集計する純粋関数。
 * 全カテゴリーを含む配列を返す（0件カテゴリーも含む）。
 */
export function groupByCategory(
  rows: Array<{ category: string }>,
): CategoryStat[] {
  const counts = new Map<CommentCategory, number>(
    CATEGORY_CONFIG.map(({ category }) => [category, 0]),
  );

  for (const row of rows) {
    const cat = row.category as CommentCategory;
    if (counts.has(cat)) {
      counts.set(cat, (counts.get(cat) ?? 0) + 1);
    }
  }

  return CATEGORY_CONFIG.map(({ category, label }) => ({
    category,
    label,
    count: counts.get(category) ?? 0,
  }));
}
