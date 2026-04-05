import { describe, it, expect } from 'vitest';
import { isActivePath } from '../is-active-path';
import { NAV_ITEMS } from '../nav-items';

// ----------------------------------------------------------------
// isActivePath
// ----------------------------------------------------------------
describe('isActivePath', () => {
  it('パスが完全一致するとき true を返す', () => {
    expect(isActivePath('/institutions', '/institutions')).toBe(true);
  });

  it('currentPath が href で始まるとき true を返す（サブルート）', () => {
    expect(isActivePath('/institutions/123', '/institutions')).toBe(true);
  });

  it('パスが一致しないとき false を返す', () => {
    expect(isActivePath('/themes', '/institutions')).toBe(false);
  });

  it('/ へのアクセスで /institutions が active にならない', () => {
    expect(isActivePath('/', '/institutions')).toBe(false);
  });

  it('同じプレフィックスの異なるパスで誤検知しない', () => {
    // /investors が /investor-details 等を誤検知しない
    expect(isActivePath('/investor-details', '/investors')).toBe(false);
  });

  it('ルート以外のパスで currentPath === href のとき true', () => {
    expect(isActivePath('/dashboard', '/dashboard')).toBe(true);
  });
});

// ----------------------------------------------------------------
// NAV_ITEMS
// ----------------------------------------------------------------
describe('NAV_ITEMS', () => {
  it('4つのナビゲーション項目を持つ', () => {
    expect(NAV_ITEMS).toHaveLength(4);
  });

  it('研究機関・研究テーマ・投資家・コメント集計のリンクを含む', () => {
    const hrefs = NAV_ITEMS.map((item) => item.href);
    expect(hrefs).toContain('/institutions');
    expect(hrefs).toContain('/themes');
    expect(hrefs).toContain('/investors');
    expect(hrefs).toContain('/dashboard');
  });

  it('各項目に label と href が存在する', () => {
    for (const item of NAV_ITEMS) {
      expect(item.label).toBeTruthy();
      expect(item.href).toBeTruthy();
    }
  });
});
