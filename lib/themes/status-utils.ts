import type { ThemeStatus } from '@/lib/types';

export const STATUS_LABELS: Record<ThemeStatus, string> = {
  active: '進行中',
  completed: '完了',
  pending: '保留',
};

const ALL_STATUSES: readonly ThemeStatus[] = ['active', 'completed', 'pending'];

/**
 * 現在のステータス以外の遷移先ステータス一覧を返す。
 */
export function getStatusTransitions(current: ThemeStatus): ThemeStatus[] {
  return ALL_STATUSES.filter((s) => s !== current);
}

/**
 * 文字列が有効な ThemeStatus か検証する。
 */
export function isValidStatus(value: string): value is ThemeStatus {
  return (ALL_STATUSES as readonly string[]).includes(value);
}
