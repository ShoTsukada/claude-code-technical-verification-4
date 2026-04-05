interface PageStatRow {
  page_id: string;
  page_label: string;
  score: number | null;
}

export interface PageStat {
  pageId: string;
  pageLabel: string;
  count: number;
  avgScore: number | null;
}

/**
 * ページIDごとのコメント件数・平均スコアを集計する純粋関数。
 * クエリ結果の行配列をそのまま受け取り、DB への依存を持たない。
 */
export function aggregatePageStats(rows: PageStatRow[]): PageStat[] {
  const grouped = new Map<string, { pageLabel: string; scores: (number | null)[] }>();

  for (const row of rows) {
    const existing = grouped.get(row.page_id);
    if (existing) {
      existing.scores.push(row.score);
    } else {
      grouped.set(row.page_id, { pageLabel: row.page_label, scores: [row.score] });
    }
  }

  return Array.from(grouped.entries()).map(([pageId, { pageLabel, scores }]) => {
    const validScores = scores.filter((s): s is number => s !== null);
    const avgScore =
      validScores.length > 0
        ? validScores.reduce((a, b) => a + b, 0) / validScores.length
        : null;
    return { pageId, pageLabel, count: scores.length, avgScore };
  });
}
