'use client';

import { useEffect } from 'react';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/feedback/Toast';
import { STATUS_LABELS } from '@/lib/themes/status-utils';
import type { ThemeFormState } from '@/lib/types';

interface ThemeFormProps {
  action: (
    prevState: ThemeFormState,
    formData: FormData,
  ) => Promise<ThemeFormState>;
  defaultValues?: {
    name?: string;
    description?: string | null;
    status?: string;
    startDate?: string | null;
  };
  submitLabel?: string;
  redirectTo?: string;
  successMessage?: string;
}

const INITIAL_STATE: ThemeFormState = {};

export function ThemeForm({
  action,
  defaultValues,
  submitLabel = '登録する',
  redirectTo = '/themes',
  successMessage = '研究テーマを登録しました',
}: ThemeFormProps) {
  const [state, formAction, isPending] = useActionState(action, INITIAL_STATE);
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      showToast('success', successMessage);
      router.push(redirectTo);
    }
  }, [state.success, showToast, successMessage, redirectTo, router]);

  return (
    <form action={formAction} noValidate className="space-y-5">
      {state.message && !state.success && (
        <div
          role="alert"
          className="rounded-lg border border-error/30 bg-error/5 px-4 py-3
                     text-sm leading-[1.7] text-error"
        >
          {state.message}
        </div>
      )}

      {/* テーマ名（必須） */}
      <div className="space-y-1">
        <label
          htmlFor="name"
          className="block text-sm font-bold leading-[1.7] text-text-body"
        >
          テーマ名
          <span className="ml-1 text-error" aria-hidden="true">*</span>
          <span className="sr-only">（必須）</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={200}
          defaultValue={defaultValues?.name ?? ''}
          aria-describedby={state.errors?.name ? 'name-error' : undefined}
          aria-invalid={!!state.errors?.name}
          className={[
            'block w-full rounded-[6px] border px-3 py-2 text-sm leading-[1.7]',
            'focus:outline-none focus:ring-2 focus:ring-[#0877d7]',
            state.errors?.name ? 'border-error' : 'border-border',
          ].join(' ')}
        />
        {state.errors?.name && (
          <p
            id="name-error"
            role="alert"
            aria-live="polite"
            className="text-sm leading-[1.7] text-error"
          >
            {state.errors.name[0]}
          </p>
        )}
      </div>

      {/* 説明 */}
      <div className="space-y-1">
        <label
          htmlFor="description"
          className="block text-sm font-bold leading-[1.7] text-text-body"
        >
          説明
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={2000}
          defaultValue={defaultValues?.description ?? ''}
          aria-describedby={state.errors?.description ? 'description-error' : undefined}
          aria-invalid={!!state.errors?.description}
          className={[
            'block w-full rounded-[6px] border px-3 py-2 text-sm leading-[1.7] resize-y',
            'focus:outline-none focus:ring-2 focus:ring-[#0877d7]',
            state.errors?.description ? 'border-error' : 'border-border',
          ].join(' ')}
        />
        {state.errors?.description && (
          <p
            id="description-error"
            role="alert"
            aria-live="polite"
            className="text-sm leading-[1.7] text-error"
          >
            {state.errors.description[0]}
          </p>
        )}
      </div>

      {/* ステータス（必須） */}
      <div className="space-y-1">
        <label
          htmlFor="status"
          className="block text-sm font-bold leading-[1.7] text-text-body"
        >
          ステータス
          <span className="ml-1 text-error" aria-hidden="true">*</span>
          <span className="sr-only">（必須）</span>
        </label>
        <select
          id="status"
          name="status"
          required
          defaultValue={defaultValues?.status ?? 'active'}
          aria-describedby={state.errors?.status ? 'status-error' : undefined}
          aria-invalid={!!state.errors?.status}
          className={[
            'block w-full rounded-[6px] border px-3 py-2 text-sm leading-[1.7]',
            'focus:outline-none focus:ring-2 focus:ring-[#0877d7] bg-surface',
            state.errors?.status ? 'border-error' : 'border-border',
          ].join(' ')}
        >
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {state.errors?.status && (
          <p
            id="status-error"
            role="alert"
            aria-live="polite"
            className="text-sm leading-[1.7] text-error"
          >
            {state.errors.status[0]}
          </p>
        )}
      </div>

      {/* 開始日 */}
      <div className="space-y-1">
        <label
          htmlFor="startDate"
          className="block text-sm font-bold leading-[1.7] text-text-body"
        >
          開始日
        </label>
        <input
          id="startDate"
          name="startDate"
          type="date"
          defaultValue={defaultValues?.startDate ?? ''}
          aria-describedby={state.errors?.startDate ? 'startDate-error' : undefined}
          aria-invalid={!!state.errors?.startDate}
          className={[
            'block w-full rounded-[6px] border px-3 py-2 text-sm leading-[1.7]',
            'focus:outline-none focus:ring-2 focus:ring-[#0877d7]',
            state.errors?.startDate ? 'border-error' : 'border-border',
          ].join(' ')}
        />
        {state.errors?.startDate && (
          <p
            id="startDate-error"
            role="alert"
            aria-live="polite"
            className="text-sm leading-[1.7] text-error"
          >
            {state.errors.startDate[0]}
          </p>
        )}
      </div>

      {/* 送信ボタン */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="inline-flex items-center gap-2 rounded-[6px] bg-primary px-6 py-2.5
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
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
