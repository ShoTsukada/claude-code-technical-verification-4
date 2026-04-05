'use client';

import { useTransition } from 'react';
import { useToast } from '@/components/feedback/Toast';
import { updateThemeStatus } from '@/lib/themes/actions';
import { getStatusTransitions, STATUS_LABELS } from '@/lib/themes/status-utils';
import type { ThemeStatus } from '@/lib/types';

interface ThemeStatusButtonProps {
  id: string;
  currentStatus: ThemeStatus;
}

export function ThemeStatusButton({ id, currentStatus }: ThemeStatusButtonProps) {
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const transitions = getStatusTransitions(currentStatus);

  const handleChange = (newStatus: ThemeStatus) => {
    startTransition(async () => {
      const result = await updateThemeStatus(id, newStatus);
      if (result.success) {
        showToast('success', `ステータスを「${STATUS_LABELS[newStatus]}」に変更しました`);
      } else {
        showToast('error', result.message ?? 'ステータスの変更に失敗しました');
      }
    });
  };

  return (
    <div className="flex items-center gap-2" aria-label="ステータスを変更">
      <span className="text-sm font-bold leading-[1.7] text-text-body">
        変更:
      </span>
      {transitions.map((status) => (
        <button
          key={status}
          type="button"
          onClick={() => handleChange(status)}
          disabled={isPending}
          aria-busy={isPending}
          className="rounded-[6px] border border-border px-3 py-1.5
                     text-sm font-medium text-text-body
                     hover:bg-surface-hover
                     disabled:opacity-50 disabled:cursor-not-allowed
                     focus-visible:outline-2 focus-visible:outline-[#0877d7]"
        >
          {STATUS_LABELS[status]}へ
        </button>
      ))}
    </div>
  );
}
