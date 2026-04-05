/**
 * FormData から文字列フィールドを取得する。
 * 空文字列・空白のみは undefined を返す（Zod の optional() と整合）。
 */
function getStringField(
  formData: FormData,
  key: string,
): string | undefined {
  const value = formData.get(key);
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

/**
 * FormData からコメントの生入力データを抽出する。
 */
export function extractCommentData(formData: FormData): {
  pageId: string | undefined;
  pageLabel: string | undefined;
  body: string | undefined;
  category: string | undefined;
  score: string | undefined;
} {
  return {
    pageId: getStringField(formData, 'pageId'),
    pageLabel: getStringField(formData, 'pageLabel'),
    body: getStringField(formData, 'body'),
    category: getStringField(formData, 'category'),
    score: getStringField(formData, 'score'),
  };
}
