import { createServerClient } from '@/lib/supabase/server';
import type { Comment, CommentCategory } from '@/lib/types';
import { groupByCategory } from './stats';
import type { CategoryStat } from './stats';
import { aggregatePageStats } from './page-stats';

interface CommentRow {
  id: string;
  page_id: string;
  page_label: string;
  body: string;
  category: string;
  score: number | null;
  created_at: string;
  updated_at: string;
}

function mapRow(row: CommentRow): Comment {
  return {
    id: row.id,
    pageId: row.page_id,
    pageLabel: row.page_label,
    body: row.body,
    category: row.category as CommentCategory,
    score: row.score,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export interface CommentQueryOptions {
  pageId?: string;
  category?: CommentCategory;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

/**
 * コメント一覧を投稿日時降順で取得する。
 */
export async function getComments(
  options: CommentQueryOptions = {},
): Promise<{ comments: Comment[]; total: number }> {
  const { pageId, category, dateFrom, dateTo, page = 1, limit = 20 } = options;
  const client = createServerClient();
  const offset = (page - 1) * limit;

  let query = client
    .from('comments')
    .select('id, page_id, page_label, body, category, score, created_at, updated_at', {
      count: 'exact',
    })
    .order('created_at', { ascending: false });

  if (pageId) query = query.eq('page_id', pageId);
  if (category) query = query.eq('category', category);
  if (dateFrom) query = query.gte('created_at', dateFrom);
  if (dateTo) query = query.lte('created_at', dateTo);

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`コメントの取得に失敗しました: ${error.message}`);
  }

  return {
    comments: (data as CommentRow[] | null ?? []).map(mapRow),
    total: count ?? 0,
  };
}

/**
 * コメントを1件取得する。
 */
export async function getCommentById(id: string): Promise<Comment | null> {
  const client = createServerClient();
  const { data, error } = await client
    .from('comments')
    .select('id, page_id, page_label, body, category, score, created_at, updated_at')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`コメントの取得に失敗しました: ${error.message}`);
  }

  return data ? mapRow(data as CommentRow) : null;
}

/**
 * ページIDごとのコメント統計（件数・平均スコア）を取得する。
 */
export async function getCommentStats(): Promise<
  Array<{ pageId: string; pageLabel: string; count: number; avgScore: number | null }>
> {
  const client = createServerClient();
  const { data, error } = await client
    .from('comments')
    .select('page_id, page_label, score');

  if (error) {
    throw new Error(`コメント統計の取得に失敗しました: ${error.message}`);
  }

  const rows = data as Array<{ page_id: string; page_label: string; score: number | null }> | null ?? [];

  return aggregatePageStats(rows);
}

/**
 * カテゴリーごとのコメント件数を取得する。
 */
export async function getCommentCategoryStats(): Promise<CategoryStat[]> {
  const client = createServerClient();
  const { data, error } = await client
    .from('comments')
    .select('category');

  if (error) {
    throw new Error(`カテゴリー統計の取得に失敗しました: ${error.message}`);
  }

  return groupByCategory(
    (data as Array<{ category: string }> | null ?? []),
  );
}
