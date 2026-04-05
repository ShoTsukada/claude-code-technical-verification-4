/**
 * 現在のパスがナビゲーション項目のアクティブ状態かどうかを判定する。
 * サブルート（/institutions/123）も一致とみなす。
 * プレフィックス誤検知（/investor-details が /investors にマッチしない）を防ぐ。
 */
export function isActivePath(currentPath: string, href: string): boolean {
  if (currentPath === href) return true;
  // サブルート判定: href の末尾に / を付けて前方一致チェック
  return currentPath.startsWith(`${href}/`);
}
