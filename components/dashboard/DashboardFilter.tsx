'use client';

import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import type { CommentCategory } from '@/lib/types';
import type { DashboardParams } from '@/lib/dashboard/query-params';

const CATEGORY_OPTIONS: Array<{ value: CommentCategory; label: string }> = [
  { value: 'improvement', label: '改善要望' },
  { value: 'bug', label: '不具合' },
  { value: 'other', label: 'その他' },
];

interface DashboardFilterProps {
  currentParams: DashboardParams;
  pageIds: string[];
}

export function DashboardFilter({ currentParams, pageIds }: DashboardFilterProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleReset = () => {
    formRef.current?.reset();
    router.push('/dashboard');
  };

  return (
    <form
      ref={formRef}
      method="get"
      action="/dashboard"
      className="rounded-lg border border-border bg-surface p-4"
    >
      <div className="flex flex-wrap items-end gap-4">
        {/* 対象画面 */}
        <div className="space-y-1 min-w-[200px]">
          <label
            htmlFor="filter-pageId"
            className="block text-sm font-bold leading-[1.7] text-text-body"
          >
            対象画面
          </label>
          <select
            id="filter-pageId"
            name="pageId"
            defaultValue={currentParams.pageId ?? ''}
            className="block w-full rounded-[6px] border border-border px-3 py-2
                       text-sm leading-[1.7] text-text-body bg-white
                       focus:outline-none focus:ring-2 focus:ring-[#0877d7]"
          >
            <option value="">すべて</option>
            {pageIds.map((pid) => (
              <option key={pid} value={pid}>
                {pid}
              </option>
            ))}
          </select>
        </div>

        {/* 種別 */}
        <div className="space-y-1 min-w-[160px]">
          <label
            htmlFor="filter-category"
            className="block text-sm font-bold leading-[1.7] text-text-body"
          >
            種別
          </label>
          <select
            id="filter-category"
            name="category"
            defaultValue={currentParams.category ?? ''}
            className="block w-full rounded-[6px] border border-border px-3 py-2
                       text-sm leading-[1.7] text-text-body bg-white
                       focus:outline-none focus:ring-2 focus:ring-[#0877d7]"
          >
            <option value="">すべて</option>
            {CATEGORY_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* 投稿日（From） */}
        <div className="space-y-1">
          <label
            htmlFor="filter-dateFrom"
            className="block text-sm font-bold leading-[1.7] text-text-body"
          >
            投稿日（開始）
          </label>
          <input
            id="filter-dateFrom"
            name="dateFrom"
            type="date"
            defaultValue={currentParams.dateFrom ?? ''}
            className="block rounded-[6px] border border-border px-3 py-2
                       text-sm leading-[1.7] text-text-body
                       focus:outline-none focus:ring-2 focus:ring-[#0877d7]"
          />
        </div>

        {/* 投稿日（To） */}
        <div className="space-y-1">
          <label
            htmlFor="filter-dateTo"
            className="block text-sm font-bold leading-[1.7] text-text-body"
          >
            投稿日（終了）
          </label>
          <input
            id="filter-dateTo"
            name="dateTo"
            type="date"
            defaultValue={currentParams.dateTo ?? ''}
            className="block rounded-[6px] border border-border px-3 py-2
                       text-sm leading-[1.7] text-text-body
                       focus:outline-none focus:ring-2 focus:ring-[#0877d7]"
          />
        </div>

        {/* ボタン */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="inline-flex items-center rounded-[6px] bg-primary px-4 py-2
                       text-sm font-bold text-white hover:bg-primary-hover
                       focus-visible:outline-2 focus-visible:outline-[#0877d7]"
          >
            絞り込む
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center rounded-[6px] border border-border px-4 py-2
                       text-sm font-medium text-text-body hover:bg-surface-hover
                       focus-visible:outline-2 focus-visible:outline-[#0877d7]"
          >
            リセット
          </button>
        </div>
      </div>
    </form>
  );
}
