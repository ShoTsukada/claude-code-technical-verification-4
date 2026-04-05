import { describe, it, expect, vi, beforeEach } from 'vitest';

// next/cache をモック
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

// Supabase クライアントをモック
const mockInsert = vi.fn();
const mockDelete = vi.fn();
const mockEq = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createServerClient: () => ({
    from: () => ({
      insert: mockInsert,
      delete: () => ({ eq: mockEq }),
    }),
  }),
}));

describe('associateEntities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('正常に関連付けできるとき success: true を返す', async () => {
    mockInsert.mockResolvedValue({ error: null });

    const { associateEntities } = await import('../actions');
    const result = await associateEntities(
      'institution',
      'id-1',
      'theme',
      'id-2',
    );

    expect(result.success).toBe(true);
  });

  it('UNIQUE制約違反（code 23505）のとき「この関連付けはすでに存在します」を返す', async () => {
    mockInsert.mockResolvedValue({
      error: { code: '23505', message: 'duplicate key value' },
    });

    const { associateEntities } = await import('../actions');
    const result = await associateEntities(
      'institution',
      'id-1',
      'theme',
      'id-2',
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toBe('この関連付けはすでに存在します');
    }
  });

  it('その他のDBエラーのとき「関連付けに失敗しました」メッセージを返す', async () => {
    mockInsert.mockResolvedValue({
      error: { code: '50000', message: 'internal server error' },
    });

    const { associateEntities } = await import('../actions');
    const result = await associateEntities(
      'institution',
      'id-1',
      'theme',
      'id-2',
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toContain('関連付けに失敗しました');
    }
  });

  it('不正なエンティティの組み合わせのとき「不正なエンティティの組み合わせです」を返す', async () => {
    const { associateEntities } = await import('../actions');
    const result = await associateEntities(
      'institution',
      'id-1',
      'institution', // 同一タイプ → junction table なし
      'id-2',
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toBe('不正なエンティティの組み合わせです');
    }
  });
});

describe('dissociateEntities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // eq().eq() チェーン用
    mockEq.mockReturnValue({ eq: mockDelete });
    mockDelete.mockResolvedValue({ error: null });
  });

  it('正常に関連付け解除できるとき success: true を返す', async () => {
    mockEq.mockReturnValue({ eq: mockDelete });
    mockDelete.mockResolvedValue({ error: null });

    const { dissociateEntities } = await import('../actions');
    const result = await dissociateEntities(
      'institution',
      'id-1',
      'theme',
      'id-2',
    );

    expect(result.success).toBe(true);
  });

  it('DBエラーのとき「関連付けの解除に失敗しました」メッセージを返す', async () => {
    mockEq.mockReturnValue({
      eq: vi.fn().mockResolvedValue({
        error: { code: '50000', message: 'db error' },
      }),
    });

    const { dissociateEntities } = await import('../actions');
    const result = await dissociateEntities(
      'institution',
      'id-1',
      'theme',
      'id-2',
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toContain('関連付けの解除に失敗しました');
    }
  });

  it('不正なエンティティの組み合わせのとき「不正なエンティティの組み合わせです」を返す', async () => {
    const { dissociateEntities } = await import('../actions');
    const result = await dissociateEntities(
      'theme',
      'id-1',
      'theme',
      'id-2',
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toBe('不正なエンティティの組み合わせです');
    }
  });
});
