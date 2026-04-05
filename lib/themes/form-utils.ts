function getStringField(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

/**
 * FormData から研究テーマの生入力データを抽出する。
 */
export function extractThemeData(formData: FormData): {
  name: string | undefined;
  description: string | undefined;
  status: string | undefined;
  startDate: string | undefined;
} {
  return {
    name: getStringField(formData, 'name'),
    description: getStringField(formData, 'description'),
    status: getStringField(formData, 'status'),
    startDate: getStringField(formData, 'startDate'),
  };
}
