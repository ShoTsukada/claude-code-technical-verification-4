import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('createServerClient', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('環境変数が正しく設定されているとき、クライアントインスタンスを返す', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

    const { createServerClient } = await import('../server');
    const client = createServerClient();

    expect(client).not.toBeNull();
    expect(client).toBeDefined();
  });

  it('NEXT_PUBLIC_SUPABASE_URL が未設定のとき、エラーをスローする', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

    const { createServerClient } = await import('../server');
    expect(() => createServerClient()).toThrow('NEXT_PUBLIC_SUPABASE_URL');
  });

  it('NEXT_PUBLIC_SUPABASE_ANON_KEY が未設定のとき、エラーをスローする', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const { createServerClient } = await import('../server');
    expect(() => createServerClient()).toThrow('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  });
});
