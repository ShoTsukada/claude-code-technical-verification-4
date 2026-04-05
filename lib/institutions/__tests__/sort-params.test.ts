import { describe, it, expect } from 'vitest';
import {
  parseSortParams,
  VALID_SORT_FIELDS,
  VALID_ORDERS,
} from '../sort-params';

describe('parseSortParams', () => {
  it('パラメーターなし → デフォルト (name / asc) を返す', () => {
    expect(parseSortParams({})).toEqual({ sort: 'name', order: 'asc' });
  });

  it('sort=name&order=asc → そのまま返す', () => {
    expect(parseSortParams({ sort: 'name', order: 'asc' })).toEqual({
      sort: 'name',
      order: 'asc',
    });
  });

  it('sort=created_at&order=desc → そのまま返す', () => {
    expect(parseSortParams({ sort: 'created_at', order: 'desc' })).toEqual({
      sort: 'created_at',
      order: 'desc',
    });
  });

  it('不正な sort フィールド → name にフォールバック', () => {
    expect(parseSortParams({ sort: 'invalid_field', order: 'asc' })).toEqual({
      sort: 'name',
      order: 'asc',
    });
  });

  it('不正な order → asc にフォールバック', () => {
    expect(parseSortParams({ sort: 'name', order: 'random' })).toEqual({
      sort: 'name',
      order: 'asc',
    });
  });

  it('undefined のパラメーター → デフォルトを使用', () => {
    expect(parseSortParams({ sort: undefined, order: undefined })).toEqual({
      sort: 'name',
      order: 'asc',
    });
  });

  it('配列渡しの場合は先頭要素を使用する', () => {
    expect(parseSortParams({ sort: ['created_at', 'name'], order: ['desc'] })).toEqual({
      sort: 'created_at',
      order: 'desc',
    });
  });
});

describe('VALID_SORT_FIELDS', () => {
  it('name を含む', () => {
    expect(VALID_SORT_FIELDS).toContain('name');
  });

  it('created_at を含む', () => {
    expect(VALID_SORT_FIELDS).toContain('created_at');
  });
});

describe('VALID_ORDERS', () => {
  it('asc を含む', () => {
    expect(VALID_ORDERS).toContain('asc');
  });

  it('desc を含む', () => {
    expect(VALID_ORDERS).toContain('desc');
  });
});
