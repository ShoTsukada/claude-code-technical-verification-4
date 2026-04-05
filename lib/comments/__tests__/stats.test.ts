import { describe, it, expect } from 'vitest';
import { groupByCategory } from '../stats';

describe('groupByCategory', () => {
  it('空配列のとき、3カテゴリーすべて0件を返す', () => {
    const result = groupByCategory([]);
    expect(result).toEqual([
      { category: 'improvement', label: '改善要望', count: 0 },
      { category: 'bug', label: '不具合', count: 0 },
      { category: 'other', label: 'その他', count: 0 },
    ]);
  });

  it('各カテゴリーのコメント数を正しく集計する', () => {
    const rows = [
      { category: 'improvement' },
      { category: 'improvement' },
      { category: 'bug' },
      { category: 'other' },
      { category: 'other' },
      { category: 'other' },
    ];
    const result = groupByCategory(rows);
    expect(result).toEqual([
      { category: 'improvement', label: '改善要望', count: 2 },
      { category: 'bug', label: '不具合', count: 1 },
      { category: 'other', label: 'その他', count: 3 },
    ]);
  });

  it('一部カテゴリーが0件のとき、0を返す', () => {
    const rows = [{ category: 'bug' }, { category: 'bug' }];
    const result = groupByCategory(rows);
    const improvement = result.find((r) => r.category === 'improvement');
    const bug = result.find((r) => r.category === 'bug');
    expect(improvement?.count).toBe(0);
    expect(bug?.count).toBe(2);
  });
});
