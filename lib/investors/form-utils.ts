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
 * FormData から投資家の生入力データを抽出する。
 */
export function extractInvestorData(formData: FormData): {
  name: string | undefined;
  investorType: string | undefined;
  contact: string | undefined;
  investmentField: string | undefined;
} {
  return {
    name: getStringField(formData, 'name'),
    investorType: getStringField(formData, 'investorType'),
    contact: getStringField(formData, 'contact'),
    investmentField: getStringField(formData, 'investmentField'),
  };
}
