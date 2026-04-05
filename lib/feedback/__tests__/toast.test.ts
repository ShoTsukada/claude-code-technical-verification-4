import { describe, it, expect } from 'vitest';
import {
  TOAST_AUTO_DISMISS_MS,
  createToast,
  type ToastMessage,
} from '../toast';

describe('TOAST_AUTO_DISMISS_MS', () => {
  it('3000ms 以上である（3秒）', () => {
    expect(TOAST_AUTO_DISMISS_MS).toBeGreaterThanOrEqual(3000);
  });

  it('5000ms 以下である（5秒）', () => {
    expect(TOAST_AUTO_DISMISS_MS).toBeLessThanOrEqual(5000);
  });
});

describe('createToast', () => {
  it('success トーストを生成できる', () => {
    const toast = createToast('success', '登録しました');
    expect(toast.type).toBe('success');
    expect(toast.message).toBe('登録しました');
    expect(toast.id).toBeTruthy();
  });

  it('error トーストを生成できる', () => {
    const toast = createToast('error', 'エラーが発生しました');
    expect(toast.type).toBe('error');
    expect(toast.message).toBe('エラーが発生しました');
  });

  it('info トーストを生成できる', () => {
    const toast = createToast('info', '処理中です');
    expect(toast.type).toBe('info');
  });

  it('生成されるトーストは毎回異なる id を持つ', () => {
    const a = createToast('success', 'A');
    const b = createToast('success', 'B');
    expect(a.id).not.toBe(b.id);
  });

  it('ToastMessage 型に適合する', () => {
    const toast: ToastMessage = createToast('success', 'テスト');
    expect(toast).toMatchObject({
      id: expect.any(String),
      type: 'success',
      message: 'テスト',
    });
  });
});
