import { describe, it, expect } from 'vitest';
import { extractCommentData } from '../form-utils';

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    fd.append(key, value);
  }
  return fd;
}

describe('extractCommentData', () => {
  it('全フィールドが入力されているとき、それぞれを返す', () => {
    const fd = makeFormData({
      pageId: 'institutions/list',
      pageLabel: '研究機関一覧',
      body: 'テストコメントです',
      category: 'improvement',
      score: '4',
    });
    expect(extractCommentData(fd)).toEqual({
      pageId: 'institutions/list',
      pageLabel: '研究機関一覧',
      body: 'テストコメントです',
      category: 'improvement',
      score: '4',
    });
  });

  it('score が未入力のとき、undefined を返す', () => {
    const fd = makeFormData({
      pageId: 'themes/detail/123',
      pageLabel: '研究テーマ詳細',
      body: 'コメント',
      category: 'bug',
    });
    const result = extractCommentData(fd);
    expect(result.score).toBeUndefined();
  });

  it('body が空のとき、undefined を返す', () => {
    const fd = makeFormData({
      pageId: 'investors/list',
      pageLabel: '投資家一覧',
      body: '',
      category: 'other',
    });
    const result = extractCommentData(fd);
    expect(result.body).toBeUndefined();
  });

  it('前後の空白をトリムする', () => {
    const fd = makeFormData({
      pageId: '  institutions/list  ',
      pageLabel: '  研究機関一覧  ',
      body: '  コメント本文  ',
      category: 'improvement',
    });
    const result = extractCommentData(fd);
    expect(result.pageId).toBe('institutions/list');
    expect(result.pageLabel).toBe('研究機関一覧');
    expect(result.body).toBe('コメント本文');
  });

  it('空白のみのフィールドは undefined を返す', () => {
    const fd = makeFormData({
      pageId: 'institutions/list',
      pageLabel: '研究機関一覧',
      body: '   ',
      category: 'other',
    });
    const result = extractCommentData(fd);
    expect(result.body).toBeUndefined();
  });

  it('score が空文字のとき、undefined を返す', () => {
    const fd = makeFormData({
      pageId: 'institutions/list',
      pageLabel: '研究機関一覧',
      body: 'コメント',
      category: 'other',
      score: '',
    });
    const result = extractCommentData(fd);
    expect(result.score).toBeUndefined();
  });
});
