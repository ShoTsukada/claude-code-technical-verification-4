import { describe, it, expect } from 'vitest';
import {
  parseInvestorQueryParams,
  VALID_INVESTOR_SORT_FIELDS,
  VALID_ORDERS,
  VALID_INVESTOR_TYPES,
} from '../query-params';

describe('parseInvestorQueryParams', () => {
  it('パラメーターなし → デフォルト (name / asc / type=undefined) を返す', () => {
    expect(parseInvestorQueryParams({})).toEqual({
      sort: 'name',
      order: 'asc',
      investorType: undefined,
    });
  });

  it('sort=name&order=asc → そのまま返す', () => {
    expect(parseInvestorQueryParams({ sort: 'name', order: 'asc' })).toEqual({
      sort: 'name',
      order: 'asc',
      investorType: undefined,
    });
  });

  it('sort=created_at&order=desc → そのまま返す', () => {
    expect(
      parseInvestorQueryParams({ sort: 'created_at', order: 'desc' }),
    ).toMatchObject({ sort: 'created_at', order: 'desc' });
  });

  it('investorType=individual を受け入れる', () => {
    expect(
      parseInvestorQueryParams({ investorType: 'individual' }),
    ).toMatchObject({ investorType: 'individual' });
  });

  it('investorType=corporate を受け入れる', () => {
    expect(
      parseInvestorQueryParams({ investorType: 'corporate' }),
    ).toMatchObject({ investorType: 'corporate' });
  });

  it('不正な investorType → undefined にフォールバック', () => {
    expect(
      parseInvestorQueryParams({ investorType: 'unknown' }),
    ).toMatchObject({ investorType: undefined });
  });

  it('不正な sort → name にフォールバック', () => {
    expect(parseInvestorQueryParams({ sort: 'bad' })).toMatchObject({
      sort: 'name',
    });
  });

  it('不正な order → asc にフォールバック', () => {
    expect(parseInvestorQueryParams({ order: 'sideways' })).toMatchObject({
      order: 'asc',
    });
  });

  it('配列渡しは先頭要素を使用する', () => {
    expect(
      parseInvestorQueryParams({ investorType: ['corporate', 'individual'] }),
    ).toMatchObject({ investorType: 'corporate' });
  });
});

describe('VALID_INVESTOR_SORT_FIELDS', () => {
  it('name と created_at を含む', () => {
    expect(VALID_INVESTOR_SORT_FIELDS).toContain('name');
    expect(VALID_INVESTOR_SORT_FIELDS).toContain('created_at');
  });
});

describe('VALID_ORDERS', () => {
  it('asc と desc を含む', () => {
    expect(VALID_ORDERS).toContain('asc');
    expect(VALID_ORDERS).toContain('desc');
  });
});

describe('VALID_INVESTOR_TYPES', () => {
  it('individual と corporate を含む', () => {
    expect(VALID_INVESTOR_TYPES).toContain('individual');
    expect(VALID_INVESTOR_TYPES).toContain('corporate');
  });
});
