'use client';

import { useEffect, useRef } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface DeleteConfirmDialogProps {
  /** ダイアログの表示状態 */
  open: boolean;
  /** 削除対象の表示名（例: "研究機関「東京大学」"） */
  targetLabel: string;
  /** 削除確定時コールバック */
  onConfirm: () => void;
  /** キャンセル時コールバック */
  onCancel: () => void;
}

const TITLE_ID = 'delete-dialog-title';
const DESC_ID = 'delete-dialog-desc';

export function DeleteConfirmDialog({
  open,
  targetLabel,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  // ダイアログが開いたらキャンセルボタンへフォーカス
  useEffect(() => {
    if (open) {
      cancelBtnRef.current?.focus();
    }
  }, [open]);

  // フォーカストラップ
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
        return;
      }
      if (e.key !== 'Tab') return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    /* バックドロップ */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onCancel}
      aria-hidden="true"
    >
      {/* ダイアログ本体 — クリックの伝播を止める */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={TITLE_ID}
        aria-describedby={DESC_ID}
        className="relative z-10 mx-4 w-full max-w-md rounded-lg bg-surface p-6 shadow-dropdown"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="shrink-0 rounded-full bg-error/10 p-2">
            <ExclamationTriangleIcon
              className="w-6 h-6 text-error"
              aria-hidden="true"
            />
          </div>

          <div className="flex-1">
            <h2
              id={TITLE_ID}
              className="text-lg font-bold leading-[1.7] text-text-body"
            >
              削除の確認
            </h2>
            <p
              id={DESC_ID}
              className="mt-1 text-base leading-[1.7] text-text-secondary"
            >
              {targetLabel} を削除しますか？この操作は取り消せません。
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onCancel}
            className="rounded px-4 py-2 text-sm font-medium text-text-body
                       border border-border hover:bg-surface-hover
                       focus-visible:outline-2 focus-visible:outline-[#0877d7]"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded px-4 py-2 text-sm font-medium text-white
                       bg-error hover:bg-error-dark
                       focus-visible:outline-2 focus-visible:outline-[#0877d7]"
          >
            削除する
          </button>
        </div>
      </div>
    </div>
  );
}
