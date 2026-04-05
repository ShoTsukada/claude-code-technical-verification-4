'use client';

import { useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Comment, CommentCategory } from '@/lib/types';

const CATEGORY_LABEL: Record<CommentCategory, string> = {
  improvement: '改善要望',
  bug: '不具合',
  other: 'その他',
};

interface CommentDetailModalProps {
  comment: Comment | null;
  onClose: () => void;
}

export function CommentDetailModal({ comment, onClose }: CommentDetailModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // フォーカストラップ + Escape キーで閉じる
  useEffect(() => {
    if (!comment) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // モーダルが開いたとき閉じるボタンにフォーカス
    const closeBtn = dialogRef.current?.querySelector<HTMLButtonElement>('button');
    closeBtn?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [comment, onClose]);

  if (!comment) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-body"
    >
      {/* バックドロップ */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* モーダル本体 */}
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-lg rounded-lg border border-border
                   bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2
            id="modal-title"
            className="text-base font-bold leading-[1.6] text-text-body"
          >
            コメント詳細
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="rounded p-1 text-text-secondary hover:bg-surface-hover
                       focus-visible:outline-2 focus-visible:outline-[#0877d7]"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* 内容 */}
        <div id="modal-body" className="space-y-4 px-5 py-4">
          <dl className="divide-y divide-border rounded-md border border-border">
            <DetailRow label="対象画面" value={comment.pageLabel} />
            <div className="flex gap-4 px-4 py-3">
              <dt className="w-24 shrink-0 text-sm font-bold leading-[1.7] text-text-body">
                種別
              </dt>
              <dd className="flex-1 text-sm leading-[1.7]">
                <span className="inline-flex items-center rounded bg-neutral-100
                                 border border-neutral-300 px-2 py-0.5 text-xs font-bold">
                  {CATEGORY_LABEL[comment.category]}
                </span>
              </dd>
            </div>
            {comment.score && (
              <div className="flex gap-4 px-4 py-3">
                <dt className="w-24 shrink-0 text-sm font-bold leading-[1.7] text-text-body">
                  スコア
                </dt>
                <dd className="flex-1 text-sm leading-[1.7] text-warning">
                  {'★'.repeat(comment.score)}
                  <span className="text-neutral-300">
                    {'★'.repeat(5 - comment.score)}
                  </span>
                </dd>
              </div>
            )}
            <DetailRow
              label="投稿日時"
              value={comment.createdAt.toLocaleString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            />
          </dl>

          <div className="space-y-1">
            <p className="text-sm font-bold leading-[1.7] text-text-body">
              コメント本文
            </p>
            <p className="rounded-md border border-border bg-neutral-50 px-4 py-3
                          text-sm leading-[1.7] text-text-body whitespace-pre-wrap">
              {comment.body}
            </p>
          </div>
        </div>

        {/* フッター */}
        <div className="border-t border-border px-5 py-3 text-right">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center rounded-[6px] border border-border px-4 py-2
                       text-sm font-medium text-text-body hover:bg-surface-hover
                       focus-visible:outline-2 focus-visible:outline-[#0877d7]"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 px-4 py-3">
      <dt className="w-24 shrink-0 text-sm font-bold leading-[1.7] text-text-body">
        {label}
      </dt>
      <dd className="flex-1 text-sm leading-[1.7] text-text-secondary">{value}</dd>
    </div>
  );
}
