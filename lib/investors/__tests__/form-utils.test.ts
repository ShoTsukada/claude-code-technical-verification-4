import { describe, it, expect } from 'vitest';
import { extractInvestorData } from '../form-utils';

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    fd.append(key, value);
  }
  return fd;
}

describe('extractInvestorData', () => {
  it('全フィールドが入力されているとき、それぞれを返す', () => {
    const fd = makeFormData({
      name: '山田 太郎',
      investorType: 'individual',
      contact: 'yamada@example.com',
      investmentField: 'バイオテクノロジー',
    });
    expect(extractInvestorData(fd)).toEqual({
      name: '山田 太郎',
      investorType: 'individual',
      contact: 'yamada@example.com',
      investmentField: 'バイオテクノロジー',
    });
  });

  it('任意フィールドが空のとき、undefined を返す', () => {
    const fd = makeFormData({
      name: '株式会社サンプル',
      investorType: 'corporate',
      contact: '',
      investmentField: '',
    });
    expect(extractInvestorData(fd)).toEqual({
      name: '株式会社サンプル',
      investorType: 'corporate',
      contact: undefined,
      investmentField: undefined,
    });
  });

  it('フィールドが存在しないとき、undefined を返す', () => {
    const fd = makeFormData({
      name: 'テスト投資家',
      investorType: 'individual',
    });
    expect(extractInvestorData(fd)).toEqual({
      name: 'テスト投資家',
      investorType: 'individual',
      contact: undefined,
      investmentField: undefined,
    });
  });

  it('前後の空白をトリムする', () => {
    const fd = makeFormData({
      name: '  テスト  ',
      investorType: 'corporate',
      contact: '  info@example.com  ',
      investmentField: '  IT・テクノロジー  ',
    });
    expect(extractInvestorData(fd)).toEqual({
      name: 'テスト',
      investorType: 'corporate',
      contact: 'info@example.com',
      investmentField: 'IT・テクノロジー',
    });
  });

  it('空白のみのフィールドは undefined を返す', () => {
    const fd = makeFormData({
      name: 'テスト',
      investorType: 'individual',
      contact: '   ',
      investmentField: '   ',
    });
    expect(extractInvestorData(fd)).toEqual({
      name: 'テスト',
      investorType: 'individual',
      contact: undefined,
      investmentField: undefined,
    });
  });
});
