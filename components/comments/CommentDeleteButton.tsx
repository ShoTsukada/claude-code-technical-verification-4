'use client';

import { useTransition } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useToast } from '@/components/feedback/Toast';
import { deleteComment } from '@/lib/comments/actions';

interface CommentDeleteButtonProps {
  id: string;
}

export function CommentDeleteButton({ id }: CommentDeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteComment(id);
      if (result.success) {
        showToast('success', 'コメントを削除しました');
      } else {
        showToast('error', result.message ?? '削除に失敗しました');
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      aria-label="コメントを削除"
      aria-busy={isPending}
      className="rounded p-1 text-text-secondary
                 hover:bg-error/10 hover:text-error
                 disabled:cursor-not-allowed disabled:opacity-50
                 focus-visible:outline-2 focus-visible:outline-[#0877d7]"
    >
      <TrashIcon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
