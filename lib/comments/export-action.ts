'use server';

import type { CommentCategory } from '@/lib/types';
import { getComments } from './queries';
import { buildCsvContent } from './csv';

export interface ExportFilters {
  pageId?: string;
  category?: CommentCategory;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * フィルター条件に合致する全コメントをCSV文字列で返す。
 * クライアント側で Blob に変換してダウンロードする。
 */
export async function exportComments(
  filters: ExportFilters,
): Promise<{ success: true; csv: string } | { success: false; message: string }> {
  try {
    // ページネーションなしで全件取得
    const { comments } = await getComments({
      ...filters,
      page: 1,
      limit: 10000,
    });

    const csv = buildCsvContent(comments);
    return { success: true, csv };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'エクスポートに失敗しました';
    return { success: false, message };
  }
}
