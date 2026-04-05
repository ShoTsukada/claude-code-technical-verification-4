import { describe, it, expect } from 'vitest';
import {
  parseThemeQueryParams,
  VALID_THEME_SORT_FIELDS,
  VALID_ORDERS,
  VALID_STATUSES,
} from '../query-params';

describe('parseThemeQueryParams', () => {
  it('パラメーターなし → デフォルト (name / asc / status=undefined) を返す', () => {
    expect(parseThemeQueryParams({})).toEqual({
      sort: 'name',
      order: 'asc',
      status: undefined,
    });
  });

  it('sort=name&order=asc → そのまま返す', () => {
    expect(parseThemeQueryParams({ sort: 'name', order: 'asc' })).toEqual({
      sort: 'name',
      order: 'asc',
      status: undefined,
    });
  });

  it('sort=created_at&order=desc → そのまま返す', () => {
    expect(
      parseThemeQueryParams({ sort: 'created_at', order: 'desc' }),
    ).toEqual({ sort: 'created_at', order: 'desc', status: undefined });
  });

  it('status=active を受け入れる', () => {
    expect(parseThemeQueryParams({ status: 'active' })).toMatchObject({
      status: 'active',
    });
  });

  it('status=completed を受け入れる', () => {
    expect(parseThemeQueryParams({ status: 'completed' })).toMatchObject({
      status: 'completed',
    });
  });

  it('status=pending を受け入れる', () => {
    expect(parseThemeQueryParams({ status: 'pending' })).toMatchObject({
      status: 'pending',
    });
  });

  it('不正な status → undefined にフォールバック（全件表示）', () => {
    expect(parseThemeQueryParams({ status: 'unknown' })).toMatchObject({
      status: undefined,
    });
  });

  it('不正な sort フィールド → name にフォールバック', () => {
    expect(parseThemeQueryParams({ sort: 'bad_field' })).toMatchObject({
      sort: 'name',
    });
  });

  it('不正な order → asc にフォールバック', () => {
    expect(parseThemeQueryParams({ order: 'sideways' })).toMatchObject({
      order: 'asc',
    });
  });

  it('配列渡しは先頭要素を使用する', () => {
    expect(
      parseThemeQueryParams({ status: ['completed', 'active'] }),
    ).toMatchObject({ status: 'completed' });
  });
});

describe('VALID_THEME_SORT_FIELDS', () => {
  it('name と created_at を含む', () => {
    expect(VALID_THEME_SORT_FIELDS).toContain('name');
    expect(VALID_THEME_SORT_FIELDS).toContain('created_at');
  });
});

describe('VALID_ORDERS', () => {
  it('asc と desc を含む', () => {
    expect(VALID_ORDERS).toContain('asc');
    expect(VALID_ORDERS).toContain('desc');
  });
});

describe('VALID_STATUSES', () => {
  it('active / completed / pending を含む', () => {
    expect(VALID_STATUSES).toContain('active');
    expect(VALID_STATUSES).toContain('completed');
    expect(VALID_STATUSES).toContain('pending');
  });
});
