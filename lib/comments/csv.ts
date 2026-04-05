import type { Comment, CommentCategory } from '@/lib/types';

export const CATEGORY_LABELS: Record<CommentCategory, string> = {
  improvement: '改善要望',
  bug: '不具合',
  other: 'その他',
};

const HEADERS = ['対象画面', '種別', 'スコア', '本文', '投稿日時'];

function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * コメント配列をCSV文字列に変換する純粋関数。
 * BOM なし UTF-8、CRLF なし LF、RFC 4180 準拠のエスケープ。
 */
export function buildCsvContent(comments: Comment[]): string {
  const headerLine = HEADERS.join(',');

  if (comments.length === 0) {
    return headerLine;
  }

  const rows = comments.map((c) => {
    const fields = [
      escapeCsvField(c.pageLabel),
      escapeCsvField(CATEGORY_LABELS[c.category]),
      c.score !== null ? String(c.score) : '',
      escapeCsvField(c.body),
      c.createdAt.toISOString(),
    ];
    return fields.join(',');
  });

  return [headerLine, ...rows].join('\n');
}
