'use client';

import { useState, useTransition } from 'react';
import { exportComments } from '@/lib/comments/export-action';
import type { ExportFilters } from '@/lib/comments/export-action';

interface ExportButtonProps {
  filters: ExportFilters;
}

export function ExportButton({ filters }: ExportButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleExport() {
    setError(null);

    startTransition(async () => {
      const result = await exportComments(filters);

      if (!result.success) {
        setError(result.message);
        return;
      }

      // BOM付き UTF-8 で Excel でも文字化けしないようにする
      const bom = '\uFEFF';
      const blob = new Blob([bom + result.csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `comments_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleExport}
        disabled={isPending}
        aria-busy={isPending}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text-body shadow-sm hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <>
            <span
              className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden="true"
            />
            エクスポート中…
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 3a.75.75 0 01.75.75v7.69l2.22-2.22a.75.75 0 011.06 1.06l-3.5 3.5a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 111.06-1.06l2.22 2.22V3.75A.75.75 0 0110 3zM4.75 14.25a.75.75 0 000 1.5h10.5a.75.75 0 000-1.5H4.75z"
                clipRule="evenodd"
              />
            </svg>
            CSVダウンロード
          </>
        )}
      </button>

      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
