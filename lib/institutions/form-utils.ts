/**
 * FormData から文字列フィールドを取得する。
 * 空文字列・空白のみは undefined を返す（Zod の optional() と整合）。
 */
export function getStringField(
  formData: FormData,
  key: string,
): string | undefined {
  const value = formData.get(key);
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

/**
 * FormData から研究機関の生入力データを抽出する。
 */
export function extractInstitutionData(formData: FormData): {
  name: string | undefined;
  location: string | undefined;
  description: string | undefined;
  contact: string | undefined;
} {
  return {
    name: getStringField(formData, 'name'),
    location: getStringField(formData, 'location'),
    description: getStringField(formData, 'description'),
    contact: getStringField(formData, 'contact'),
  };
}
