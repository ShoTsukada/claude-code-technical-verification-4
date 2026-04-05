import { describe, it, expect } from 'vitest';
import { parseDashboardParams } from '../query-params';

describe('parseDashboardParams', () => {
  it('パラメーターなし → デフォルトを返す', () => {
    expect(parseDashboardParams({})).toEqual({
      pageId: undefined,
      category: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      page: 1,
    });
  });

  it('全パラメーター指定 → それぞれを返す', () => {
    expect(
      parseDashboardParams({
        pageId: 'institution/list',
        category: 'improvement',
        dateFrom: '2026-01-01',
        dateTo: '2026-12-31',
        page: '3',
      }),
    ).toEqual({
      pageId: 'institution/list',
      category: 'improvement',
      dateFrom: '2026-01-01',
      dateTo: '2026-12-31',
      page: 3,
    });
  });

  it('不正な category → undefined にフォールバック', () => {
    const result = parseDashboardParams({ category: 'invalid' });
    expect(result.category).toBeUndefined();
  });

  it('不正な page（0以下）→ 1 にフォールバック', () => {
    expect(parseDashboardParams({ page: '0' }).page).toBe(1);
    expect(parseDashboardParams({ page: '-5' }).page).toBe(1);
  });

  it('不正な page（非数値）→ 1 にフォールバック', () => {
    expect(parseDashboardParams({ page: 'abc' }).page).toBe(1);
  });

  it('page が配列のとき、先頭要素を使用する', () => {
    expect(parseDashboardParams({ page: ['2', '5'] }).page).toBe(2);
  });

  it('有効な category をそのまま返す', () => {
    expect(parseDashboardParams({ category: 'bug' }).category).toBe('bug');
    expect(parseDashboardParams({ category: 'other' }).category).toBe('other');
  });

  it('pageId が空文字のとき undefined を返す', () => {
    expect(parseDashboardParams({ pageId: '' }).pageId).toBeUndefined();
  });
});
