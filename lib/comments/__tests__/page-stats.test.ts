import { describe, it, expect } from 'vitest';
import { aggregatePageStats } from '../page-stats';

describe('aggregatePageStats', () => {
  it('空配列のとき空配列を返す', () => {
    const result = aggregatePageStats([]);
    expect(result).toEqual([]);
  });

  it('1ページ・スコアなしのとき count=1, avgScore=null', () => {
    const rows = [
      { page_id: 'institution/list', page_label: '研究機関一覧', score: null },
    ];
    const result = aggregatePageStats(rows);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      pageId: 'institution/list',
      pageLabel: '研究機関一覧',
      count: 1,
      avgScore: null,
    });
  });

  it('1ページ・スコアあり1件のとき avgScore = そのスコア', () => {
    const rows = [
      { page_id: 'institution/list', page_label: '研究機関一覧', score: 4 },
    ];
    const result = aggregatePageStats(rows);
    expect(result[0].avgScore).toBe(4);
  });

  it('1ページ・複数スコアのとき avgScore を正しく計算する', () => {
    const rows = [
      { page_id: 'theme/list', page_label: 'テーマ一覧', score: 3 },
      { page_id: 'theme/list', page_label: 'テーマ一覧', score: 5 },
    ];
    const result = aggregatePageStats(rows);
    expect(result).toHaveLength(1);
    expect(result[0].count).toBe(2);
    expect(result[0].avgScore).toBe(4); // (3+5)/2
  });

  it('スコアあり・なしが混在する場合、スコアありのみで平均を計算する', () => {
    const rows = [
      { page_id: 'institution/list', page_label: '研究機関一覧', score: 4 },
      { page_id: 'institution/list', page_label: '研究機関一覧', score: null },
      { page_id: 'institution/list', page_label: '研究機関一覧', score: 2 },
    ];
    const result = aggregatePageStats(rows);
    expect(result[0].count).toBe(3);
    expect(result[0].avgScore).toBe(3); // (4+2)/2
  });

  it('全件スコアなしのとき avgScore=null', () => {
    const rows = [
      { page_id: 'theme/list', page_label: 'テーマ一覧', score: null },
      { page_id: 'theme/list', page_label: 'テーマ一覧', score: null },
    ];
    const result = aggregatePageStats(rows);
    expect(result[0].avgScore).toBeNull();
  });

  it('複数ページをそれぞれ正しく集計する', () => {
    const rows = [
      { page_id: 'institution/list', page_label: '研究機関一覧', score: 5 },
      { page_id: 'theme/list',       page_label: 'テーマ一覧',   score: 3 },
      { page_id: 'institution/list', page_label: '研究機関一覧', score: 3 },
    ];
    const result = aggregatePageStats(rows);
    const institution = result.find((r) => r.pageId === 'institution/list')!;
    const theme = result.find((r) => r.pageId === 'theme/list')!;
    expect(institution.count).toBe(2);
    expect(institution.avgScore).toBe(4); // (5+3)/2
    expect(theme.count).toBe(1);
    expect(theme.avgScore).toBe(3);
  });
});
