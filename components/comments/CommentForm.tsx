'use client';

import { useEffect, useRef } from 'react';
import { useActionState } from 'react';
import { useToast } from '@/components/feedback/Toast';
import { createComment } from '@/lib/comments/actions';
import type { CommentCategory, CommentFormState } from '@/lib/types';

const CATEGORY_OPTIONS: Array<{ value: CommentCategory; label: string }> = [
  { value: 'improvement', label: '改善要望' },
  { value: 'bug', label: '不具合' },
  { value: 'other', label: 'その他' },
];

interface CommentFormProps {
  /** 対象画面の識別子（例: "institutions/list"） */
  pageId: string;
  /** 対象画面の表示名（例: "研究機関一覧"） */
  pageLabel: string;
  /** 送信成功時のトーストメッセージ */
  successMessage?: string;
}

const INITIAL_STATE: CommentFormState = {};

export function CommentForm({
  pageId,
  pageLabel,
  successMessage = 'コメントを投稿しました',
}: CommentFormProps) {
  const [state, formAction, isPending] = useActionState(createComment, INITIAL_STATE);
  const { showToast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  // 成功時: フォームリセット + トースト表示
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      showToast('success', successMessage);
    }
  }, [state.success, showToast, successMessage]);

  return (
    <form ref={formRef} action={formAction} noValidate className="space-y-4">
      {/* hidden フィールド */}
      <input type="hidden" name="pageId" value={pageId} />
      <input type="hidden" name="pageLabel" value={pageLabel} />

      {/* システムエラーメッセージ */}
      {state.message && !state.success && (
        <div
          role="alert"
          className="rounded-lg border border-error/30 bg-error/5 px-4 py-3
                     text-sm leading-[1.7] text-error"
        >
          {state.message}
        </div>
      )}

      {/* コメント本文（必須） */}
      <div className="space-y-1">
        <label
          htmlFor="comment-body"
          className="block text-sm font-bold leading-[1.7] text-text-body"
        >
          コメント本文
          <span className="ml-1 text-error" aria-hidden="true">*</span>
          <span className="sr-only">（必須）</span>
        </label>
        <textarea
          id="comment-body"
          name="body"
          rows={4}
          required
          maxLength={1000}
          disabled={isPending}
          aria-describedby={state.errors?.body ? 'body-error' : undefined}
          aria-invalid={!!state.errors?.body}
          className={[
            'block w-full rounded-[6px] border px-3 py-2 text-sm leading-[1.7] resize-y',
            'focus:outline-none focus:ring-2 focus:ring-[#0877d7]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            state.errors?.body ? 'border-error' : 'border-border',
            'text-text-body',
          ].join(' ')}
          placeholder="ご意見・ご感想をお聞かせください（最大1000文字）"
        />
        {state.errors?.body && (
          <p
            id="body-error"
            role="alert"
            aria-live="polite"
            className="text-sm leading-[1.7] text-error"
          >
            {state.errors.body[0]}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-6">
        {/* 種別（必須） */}
        <div className="space-y-1 min-w-[160px]">
          <label
            htmlFor="comment-category"
            className="block text-sm font-bold leading-[1.7] text-text-body"
          >
            種別
            <span className="ml-1 text-error" aria-hidden="true">*</span>
            <span className="sr-only">（必須）</span>
          </label>
          <select
            id="comment-category"
            name="category"
            required
            disabled={isPending}
            aria-describedby={state.errors?.category ? 'category-error' : undefined}
            aria-invalid={!!state.errors?.category}
            className={[
              'block w-full rounded-[6px] border px-3 py-2 text-sm leading-[1.7]',
              'focus:outline-none focus:ring-2 focus:ring-[#0877d7]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              state.errors?.category ? 'border-error' : 'border-border',
              'text-text-body bg-white',
            ].join(' ')}
          >
            <option value="">選択してください</option>
            {CATEGORY_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {state.errors?.category && (
            <p
              id="category-error"
              role="alert"
              aria-live="polite"
              className="text-sm leading-[1.7] text-error"
            >
              {state.errors.category[0]}
            </p>
          )}
        </div>

        {/* 評価スコア（任意・1〜5） */}
        <fieldset className="space-y-1">
          <legend className="block text-sm font-bold leading-[1.7] text-text-body">
            評価スコア
            <span className="ml-1 text-sm font-normal text-text-secondary">（任意）</span>
          </legend>
          <div
            className="flex items-center gap-1"
            aria-describedby={state.errors?.score ? 'score-error' : undefined}
          >
            {/* スコアなし */}
            <label className="sr-only">
              <input type="radio" name="score" value="" defaultChecked />
              なし
            </label>
            {[1, 2, 3, 4, 5].map((n) => (
              <label
                key={n}
                className="cursor-pointer text-2xl leading-none text-neutral-300
                           has-[:checked]:text-warning
                           hover:text-warning transition-colors"
                title={`${n}点`}
              >
                <input
                  type="radio"
                  name="score"
                  value={String(n)}
                  disabled={isPending}
                  className="sr-only"
                />
                ★
              </label>
            ))}
          </div>
          {state.errors?.score && (
            <p
              id="score-error"
              role="alert"
              aria-live="polite"
              className="text-sm leading-[1.7] text-error"
            >
              {state.errors.score[0]}
            </p>
          )}
        </fieldset>
      </div>

      {/* 送信ボタン */}
      <div className="pt-1">
        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="inline-flex items-center gap-2 rounded-[6px] bg-primary px-5 py-2
                     text-sm font-bold text-white hover:bg-primary-hover
                     disabled:opacity-50 disabled:cursor-not-allowed
                     focus-visible:outline-2 focus-visible:outline-[#0877d7]"
        >
          {isPending ? (
            <>
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden="true"
              />
              送信中...
            </>
          ) : (
            'コメントを投稿する'
          )}
        </button>
      </div>
    </form>
  );
}
