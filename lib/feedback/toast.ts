export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

/** トーストの自動消去時間（ms）。3〜5秒の範囲。 */
export const TOAST_AUTO_DISMISS_MS = 4000;

let counter = 0;

/**
 * 一意な ID を持つ ToastMessage を生成する。
 */
export function createToast(type: ToastType, message: string): ToastMessage {
  counter += 1;
  return {
    id: `toast-${Date.now()}-${counter}`,
    type,
    message,
  };
}
