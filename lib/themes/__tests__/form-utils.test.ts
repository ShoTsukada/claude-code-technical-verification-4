import { describe, it, expect } from 'vitest';
import { extractThemeData } from '../form-utils';

describe('extractThemeData', () => {
  it('全フィールドを正しく抽出する', () => {
    const fd = new FormData();
    fd.append('name', '量子コンピューター研究');
    fd.append('description', '次世代計算機の基礎研究');
    fd.append('status', 'active');
    fd.append('startDate', '2026-01-15');

    expect(extractThemeData(fd)).toEqual({
      name: '量子コンピューター研究',
      description: '次世代計算機の基礎研究',
      status: 'active',
      startDate: '2026-01-15',
    });
  });

  it('オプションフィールドが空の場合は undefined を返す', () => {
    const fd = new FormData();
    fd.append('name', '量子コンピューター研究');
    fd.append('description', '');
    fd.append('status', 'pending');
    fd.append('startDate', '');

    const result = extractThemeData(fd);
    expect(result.name).toBe('量子コンピューター研究');
    expect(result.description).toBeUndefined();
    expect(result.startDate).toBeUndefined();
  });

  it('name が空の場合は undefined を返す（Zodで必須エラーになる）', () => {
    const fd = new FormData();
    fd.append('name', '');
    fd.append('status', 'active');

    expect(extractThemeData(fd).name).toBeUndefined();
  });

  it('status が空の場合は undefined を返す（Zodで必須エラーになる）', () => {
    const fd = new FormData();
    fd.append('name', 'テスト');
    fd.append('status', '');

    expect(extractThemeData(fd).status).toBeUndefined();
  });

  it('前後の空白をトリムする', () => {
    const fd = new FormData();
    fd.append('name', '  量子研究  ');
    fd.append('status', 'active');

    expect(extractThemeData(fd).name).toBe('量子研究');
  });
});
