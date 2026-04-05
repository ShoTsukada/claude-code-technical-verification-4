import { describe, it, expect } from 'vitest';
import {
  institutionSchema,
  themeSchema,
  investorSchema,
  commentSchema,
} from '../schemas';

// ----------------------------------------------------------------
// institutionSchema
// ----------------------------------------------------------------
describe('institutionSchema', () => {
  it('必須項目（name）のみで正常にパースできる', () => {
    const result = institutionSchema.safeParse({ name: '東京大学' });
    expect(result.success).toBe(true);
  });

  it('全項目を指定して正常にパースできる', () => {
    const result = institutionSchema.safeParse({
      name: '東京大学',
      location: '東京都文京区',
      description: '国立大学法人',
      contact: 'info@u-tokyo.ac.jp',
    });
    expect(result.success).toBe(true);
  });

  it('name が空文字のとき失敗する', () => {
    const result = institutionSchema.safeParse({ name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const nameErrors = result.error.issues.filter(
        (i) => i.path[0] === 'name'
      );
      expect(nameErrors.length).toBeGreaterThan(0);
    }
  });

  it('name が 201 文字のとき失敗する', () => {
    const result = institutionSchema.safeParse({ name: 'a'.repeat(201) });
    expect(result.success).toBe(false);
  });

  it('name が省略されたとき失敗する', () => {
    const result = institutionSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('description が 2001 文字のとき失敗する', () => {
    const result = institutionSchema.safeParse({
      name: '大学',
      description: 'a'.repeat(2001),
    });
    expect(result.success).toBe(false);
  });
});

// ----------------------------------------------------------------
// themeSchema
// ----------------------------------------------------------------
describe('themeSchema', () => {
  it('必須項目のみで正常にパースできる', () => {
    const result = themeSchema.safeParse({ name: 'AI研究', status: 'active' });
    expect(result.success).toBe(true);
  });

  it('name が空文字のとき失敗する', () => {
    const result = themeSchema.safeParse({ name: '', status: 'active' });
    expect(result.success).toBe(false);
  });

  it('status が無効値のとき失敗する', () => {
    const result = themeSchema.safeParse({ name: 'AI研究', status: 'unknown' });
    expect(result.success).toBe(false);
  });

  it("status が 'active' | 'completed' | 'pending' のとき成功する", () => {
    for (const status of ['active', 'completed', 'pending'] as const) {
      const result = themeSchema.safeParse({ name: 'テーマ', status });
      expect(result.success).toBe(true);
    }
  });
});

// ----------------------------------------------------------------
// investorSchema
// ----------------------------------------------------------------
describe('investorSchema', () => {
  it('必須項目のみで正常にパースできる', () => {
    const result = investorSchema.safeParse({
      name: '山田太郎',
      investorType: 'individual',
    });
    expect(result.success).toBe(true);
  });

  it('name が空文字のとき失敗する', () => {
    const result = investorSchema.safeParse({
      name: '',
      investorType: 'individual',
    });
    expect(result.success).toBe(false);
  });

  it('investorType が無効値のとき失敗する', () => {
    const result = investorSchema.safeParse({
      name: '山田',
      investorType: 'company',
    });
    expect(result.success).toBe(false);
  });

  it("investorType が 'individual' | 'corporate' のとき成功する", () => {
    for (const investorType of ['individual', 'corporate'] as const) {
      const result = investorSchema.safeParse({ name: '投資家', investorType });
      expect(result.success).toBe(true);
    }
  });
});

// ----------------------------------------------------------------
// commentSchema
// ----------------------------------------------------------------
describe('commentSchema', () => {
  const validBase = {
    pageId: 'institutions/list',
    pageLabel: '研究機関一覧',
    body: 'UIが使いにくいです',
    category: 'improvement' as const,
  };

  it('必須項目のみで正常にパースできる', () => {
    const result = commentSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it('score を 1〜5 で指定したとき成功する', () => {
    for (const score of [1, 2, 3, 4, 5]) {
      const result = commentSchema.safeParse({ ...validBase, score });
      expect(result.success).toBe(true);
    }
  });

  it('score を文字列数値で指定したとき coerce されて成功する', () => {
    const result = commentSchema.safeParse({ ...validBase, score: '3' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.score).toBe(3);
    }
  });

  it('body が空文字のとき失敗する', () => {
    const result = commentSchema.safeParse({ ...validBase, body: '' });
    expect(result.success).toBe(false);
  });

  it('body が 1001 文字のとき失敗する', () => {
    const result = commentSchema.safeParse({
      ...validBase,
      body: 'a'.repeat(1001),
    });
    expect(result.success).toBe(false);
  });

  it('category が無効値のとき失敗する', () => {
    const result = commentSchema.safeParse({
      ...validBase,
      category: 'invalid',
    });
    expect(result.success).toBe(false);
  });

  it("category が 'improvement' | 'bug' | 'other' のとき成功する", () => {
    for (const category of ['improvement', 'bug', 'other'] as const) {
      const result = commentSchema.safeParse({ ...validBase, category });
      expect(result.success).toBe(true);
    }
  });

  it('score が 0 のとき失敗する', () => {
    const result = commentSchema.safeParse({ ...validBase, score: 0 });
    expect(result.success).toBe(false);
  });

  it('score が 6 のとき失敗する', () => {
    const result = commentSchema.safeParse({ ...validBase, score: 6 });
    expect(result.success).toBe(false);
  });

  it('pageId が空文字のとき失敗する', () => {
    const result = commentSchema.safeParse({ ...validBase, pageId: '' });
    expect(result.success).toBe(false);
  });
});
