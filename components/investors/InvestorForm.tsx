'use client';

import { useEffect } from 'react';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/feedback/Toast';
import type { InvestorType, InvestorFormState } from '@/lib/types';

const INVESTOR_TYPE_OPTIONS: Array<{ value: InvestorType; label: string }> = [
  { value: 'individual', label: '個人' },
  { value: 'corporate', label: '法人' },
];

interface InvestorFormProps {
  /** createInvestor または updateInvestor.bind(null, id) を渡す */
  action: (
    prevState: InvestorFormState,
    formData: FormData,
  ) => Promise<InvestorFormState>;
  /** 編集時の初期値 */
  defaultValues?: {
    name?: string;
    investorType?: InvestorType;
    contact?: string | null;
    investmentField?: string | null;
  };
  /** 送信ボタンのラベル */
  submitLabel?: string;
  /** 成功後のリダイレクト先 */
  redirectTo?: string;
  /** 成功時トーストメッセージ */
  successMessage?: string;
}

const INITIAL_STATE: InvestorFormState = {};

export function InvestorForm({
  action,
  defaultValues,
  submitLabel = '登録する',
  redirectTo = '/investors',
  successMessage = '投資家を登録しました',
}: InvestorFormProps) {
  const [state, formAction, isPending] = useActionState(action, INITIAL_STATE);
  const { showToast } = useToast();
  const router = useRouter();

  // 成功時: トースト表示 → リダイレクト
  useEffect(() => {
    if (state.success) {
      showToast('success', successMessage);
      router.push(redirectTo);
    }
  }, [state.success, showToast, successMessage, redirectTo, router]);

  return (
    <form action={formAction} noValidate className="space-y-5">
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

      {/* 投資家名（必須） */}
      <div className="space-y-1">
        <label
          htmlFor="name"
          className="block text-sm font-bold leading-[1.7] text-text-body"
        >
          投資家名
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
            state.errors?.name
              ? 'border-error text-text-body'
              : 'border-border text-text-body',
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

      {/* 種別（必須・ラジオボタン） */}
      <fieldset className="space-y-1">
        <legend className="block text-sm font-bold leading-[1.7] text-text-body">
          種別
          <span className="ml-1 text-error" aria-hidden="true">*</span>
          <span className="sr-only">（必須）</span>
        </legend>
        <div
          className="flex gap-6"
          aria-describedby={state.errors?.investorType ? 'investorType-error' : undefined}
        >
          {INVESTOR_TYPE_OPTIONS.map(({ value, label }) => (
            <label
              key={value}
              className="inline-flex cursor-pointer items-center gap-2 text-sm leading-[1.7] text-text-body"
            >
              <input
                type="radio"
                name="investorType"
                value={value}
                defaultChecked={defaultValues?.investorType === value}
                className="h-4 w-4 accent-primary focus:ring-2 focus:ring-[#0877d7]"
              />
              {label}
            </label>
          ))}
        </div>
        {state.errors?.investorType && (
          <p
            id="investorType-error"
            role="alert"
            aria-live="polite"
            className="text-sm leading-[1.7] text-error"
          >
            {state.errors.investorType[0]}
          </p>
        )}
      </fieldset>

      {/* 連絡先 */}
      <div className="space-y-1">
        <label
          htmlFor="contact"
          className="block text-sm font-bold leading-[1.7] text-text-body"
        >
          連絡先
        </label>
        <input
          id="contact"
          name="contact"
          type="text"
          maxLength={200}
          defaultValue={defaultValues?.contact ?? ''}
          aria-describedby={state.errors?.contact ? 'contact-error' : undefined}
          aria-invalid={!!state.errors?.contact}
          className={[
            'block w-full rounded-[6px] border px-3 py-2 text-sm leading-[1.7]',
            'focus:outline-none focus:ring-2 focus:ring-[#0877d7]',
            state.errors?.contact
              ? 'border-error text-text-body'
              : 'border-border text-text-body',
          ].join(' ')}
        />
        {state.errors?.contact && (
          <p
            id="contact-error"
            role="alert"
            aria-live="polite"
            className="text-sm leading-[1.7] text-error"
          >
            {state.errors.contact[0]}
          </p>
        )}
      </div>

      {/* 投資分野 */}
      <div className="space-y-1">
        <label
          htmlFor="investmentField"
          className="block text-sm font-bold leading-[1.7] text-text-body"
        >
          投資分野
        </label>
        <input
          id="investmentField"
          name="investmentField"
          type="text"
          maxLength={200}
          defaultValue={defaultValues?.investmentField ?? ''}
          aria-describedby={state.errors?.investmentField ? 'investmentField-error' : undefined}
          aria-invalid={!!state.errors?.investmentField}
          className={[
            'block w-full rounded-[6px] border px-3 py-2 text-sm leading-[1.7]',
            'focus:outline-none focus:ring-2 focus:ring-[#0877d7]',
            state.errors?.investmentField
              ? 'border-error text-text-body'
              : 'border-border text-text-body',
          ].join(' ')}
        />
        {state.errors?.investmentField && (
          <p
            id="investmentField-error"
            role="alert"
            aria-live="polite"
            className="text-sm leading-[1.7] text-error"
          >
            {state.errors.investmentField[0]}
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
