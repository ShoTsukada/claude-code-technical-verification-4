'use client';

import { useState, useTransition } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { DeleteConfirmDialog } from '@/components/feedback/DeleteConfirmDialog';
import { deleteInvestor } from '@/lib/investors/actions';

interface InvestorDeleteButtonProps {
  id: string;
  name: string;
}

export function InvestorDeleteButton({ id, name }: InvestorDeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      await deleteInvestor(id);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-[6px] border border-error
                   px-4 py-2 text-sm font-medium text-error
                   hover:bg-error hover:text-white
                   disabled:opacity-50 disabled:cursor-not-allowed
                   focus-visible:outline-2 focus-visible:outline-[#0877d7]"
        aria-busy={isPending}
      >
        <TrashIcon className="w-4 h-4" aria-hidden="true" />
        削除
      </button>

      <DeleteConfirmDialog
        open={open}
        targetLabel={`投資家「${name}」`}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
