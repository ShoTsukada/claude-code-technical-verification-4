import { describe, it, expect } from 'vitest';
import { buildCsvContent, CATEGORY_LABELS } from '../csv';

describe('CATEGORY_LABELS', () => {
  it('improvement → 改善要望', () => {
    expect(CATEGORY_LABELS.improvement).toBe('改善要望');
  });

  it('bug → 不具合', () => {
    expect(CATEGORY_LABELS.bug).toBe('不具合');
  });

  it('other → その他', () => {
    expect(CATEGORY_LABELS.other).toBe('その他');
  });
});

describe('buildCsvContent', () => {
  it('空配列のとき、ヘッダー行のみ返す', () => {
    const csv = buildCsvContent([]);
    const lines = csv.split('\n');
    expect(lines).toHaveLength(1);
    expect(lines[0]).toBe('対象画面,種別,スコア,本文,投稿日時');
  });

  it('コメント1件を正しくCSV行に変換する', () => {
    const comment = {
      id: '1',
      pageId: 'institution/list',
      pageLabel: '研究機関一覧',
      body: 'テストコメント',
      category: 'improvement' as const,
      score: 4,
      createdAt: new Date('2026-04-05T10:00:00Z'),
      updatedAt: new Date('2026-04-05T10:00:00Z'),
    };
    const csv = buildCsvContent([comment]);
    const lines = csv.split('\n');
    expect(lines).toHaveLength(2);
    expect(lines[1]).toBe('研究機関一覧,改善要望,4,テストコメント,2026-04-05T10:00:00.000Z');
  });

  it('スコアがnullのとき、スコア列は空文字', () => {
    const comment = {
      id: '2',
      pageId: 'theme/list',
      pageLabel: '研究テーマ一覧',
      body: 'スコアなし',
      category: 'other' as const,
      score: null,
      createdAt: new Date('2026-04-05T11:00:00Z'),
      updatedAt: new Date('2026-04-05T11:00:00Z'),
    };
    const csv = buildCsvContent([comment]);
    const lines = csv.split('\n');
    expect(lines[1]).toBe('研究テーマ一覧,その他,,スコアなし,2026-04-05T11:00:00.000Z');
  });

  it('本文にカンマが含まれる場合、ダブルクォートでエスケープする', () => {
    const comment = {
      id: '3',
      pageId: 'institution/list',
      pageLabel: '研究機関一覧',
      body: 'カンマ,を含む本文',
      category: 'bug' as const,
      score: null,
      createdAt: new Date('2026-04-05T12:00:00Z'),
      updatedAt: new Date('2026-04-05T12:00:00Z'),
    };
    const csv = buildCsvContent([comment]);
    const lines = csv.split('\n');
    expect(lines[1]).toContain('"カンマ,を含む本文"');
  });

  it('本文にダブルクォートが含まれる場合、エスケープする', () => {
    const comment = {
      id: '4',
      pageId: 'institution/list',
      pageLabel: '研究機関一覧',
      body: '本文に"引用符"あり',
      category: 'other' as const,
      score: null,
      createdAt: new Date('2026-04-05T13:00:00Z'),
      updatedAt: new Date('2026-04-05T13:00:00Z'),
    };
    const csv = buildCsvContent([comment]);
    const lines = csv.split('\n');
    expect(lines[1]).toContain('"本文に""引用符""あり"');
  });

  it('複数コメントを正しく変換する', () => {
    const comments = [
      {
        id: '1',
        pageId: 'institution/list',
        pageLabel: '研究機関一覧',
        body: '最初のコメント',
        category: 'improvement' as const,
        score: 5,
        createdAt: new Date('2026-04-05T10:00:00Z'),
        updatedAt: new Date('2026-04-05T10:00:00Z'),
      },
      {
        id: '2',
        pageId: 'theme/list',
        pageLabel: '研究テーマ一覧',
        body: '2番目のコメント',
        category: 'bug' as const,
        score: null,
        createdAt: new Date('2026-04-05T11:00:00Z'),
        updatedAt: new Date('2026-04-05T11:00:00Z'),
      },
    ];
    const csv = buildCsvContent(comments);
    const lines = csv.split('\n');
    expect(lines).toHaveLength(3);
  });
});
