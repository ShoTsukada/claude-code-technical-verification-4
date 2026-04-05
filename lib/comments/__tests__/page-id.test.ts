import { describe, it, expect } from 'vitest';
import { buildPageId, buildPageLabel } from '../page-id';

describe('buildPageId', () => {
  it('一覧ページの pageId を生成する', () => {
    expect(buildPageId('institution', 'list')).toBe('institution/list');
    expect(buildPageId('theme', 'list')).toBe('theme/list');
    expect(buildPageId('investor', 'list')).toBe('investor/list');
  });

  it('詳細ページの pageId を ID 付きで生成する', () => {
    expect(buildPageId('institution', 'detail', 'abc-123')).toBe('institution/detail/abc-123');
    expect(buildPageId('theme', 'detail', 'xyz-789')).toBe('theme/detail/xyz-789');
    expect(buildPageId('investor', 'detail', 'inv-456')).toBe('investor/detail/inv-456');
  });
});

describe('buildPageLabel', () => {
  it('機関一覧ページのラベルを返す', () => {
    expect(buildPageLabel('institution', 'list')).toBe('研究機関一覧');
  });

  it('機関詳細ページのラベルを返す', () => {
    expect(buildPageLabel('institution', 'detail')).toBe('研究機関詳細');
  });

  it('テーマ一覧ページのラベルを返す', () => {
    expect(buildPageLabel('theme', 'list')).toBe('研究テーマ一覧');
  });

  it('テーマ詳細ページのラベルを返す', () => {
    expect(buildPageLabel('theme', 'detail')).toBe('研究テーマ詳細');
  });

  it('投資家一覧ページのラベルを返す', () => {
    expect(buildPageLabel('investor', 'list')).toBe('投資家一覧');
  });

  it('投資家詳細ページのラベルを返す', () => {
    expect(buildPageLabel('investor', 'detail')).toBe('投資家詳細');
  });
});
