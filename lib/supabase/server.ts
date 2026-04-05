import { createClient } from '@supabase/supabase-js';

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `${key} が設定されていません。.env.local を確認してください。`
    );
  }
  return value;
}

/**
 * サーバーサイド専用の Supabase クライアントを生成する。
 * クライアントコンポーネントからは使用禁止。
 * 環境変数は呼び出し時に検証する（ビルド時実行を回避）。
 */
export function createServerClient() {
  const supabaseUrl = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
  const supabaseAnonKey = requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  return createClient(supabaseUrl, supabaseAnonKey);
}
