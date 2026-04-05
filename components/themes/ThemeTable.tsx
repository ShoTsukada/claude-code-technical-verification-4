import Link from 'next/link';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import type { Theme, ThemeStatus } from '@/lib/types';
import type { ThemeSortField, SortOrder } from '@/lib/themes/query-params';

// ----------------------------------------------------------------
// ステータスバッジ
// ----------------------------------------------------------------

const STATUS_LABEL: Record<ThemeStatus, string> = {
  active: '進行中',
  completed: '完了',
  pending: '保留',
};

const STATUS_COLOR: Record<ThemeStatus, string> = {
  active: 'bg-success/10 text-success-dark border border-success/30',
  completed: 'bg-neutral-100 text-text-secondary border border-border',
  pending: 'bg-warning/10 text-warning-dark border border-warning/30',
};

function StatusBadge({ status }: { status: ThemeStatus }) {
  return (
    <span
      className={[
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-bold leading-[1.0]',
        STATUS_COLOR[status],
      ].join(' ')}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

// ----------------------------------------------------------------
// ソータブルヘッダー
// ----------------------------------------------------------------

interface SortableHeaderProps {
  label: string;
  field: ThemeSortField;
  currentSort: ThemeSortField;
  currentOrder: SortOrder;
  currentStatus?: ThemeStatus;
}

function SortableHeader({
  label,
  field,
  currentSort,
  currentOrder,
  currentStatus,
}: SortableHeaderProps) {
  const isActive = currentSort === field;
  const nextOrder: SortOrder =
    isActive && currentOrder === 'asc' ? 'desc' : 'asc';
  const ariaSortValue = isActive
    ? currentOrder === 'asc'
      ? 'ascending'
      : 'descending'
    : 'none';

  const params = new URLSearchParams({ sort: field, order: nextOrder });
  if (currentStatus) params.set('status', currentStatus);

  return (
    <th
      scope="col"
      aria-sort={ariaSortValue as 'ascending' | 'descending' | 'none' | 'other'}
      className="px-4 py-3 text-left text-sm font-bold leading-[1.7] text-text-body"
    >
      <Link
        href={`?${params.toString()}`}
        className="inline-flex items-center gap-1 hover:text-primary
                   focus-visible:outline-2 focus-visible:outline-[#0877d7] rounded"
      >
        {label}
        {isActive ? (
          currentOrder === 'asc' ? (
            <ChevronUpIcon className="w-4 h-4 text-primary" aria-hidden="true" />
          ) : (
            <ChevronDownIcon className="w-4 h-4 text-primary" aria-hidden="true" />
          )
        ) : (
          <span className="w-4 h-4" aria-hidden="true" />
        )}
      </Link>
    </th>
  );
}

// ----------------------------------------------------------------
// ステータスフィルター
// ----------------------------------------------------------------

interface StatusFilterProps {
  currentStatus?: ThemeStatus;
  currentSort: ThemeSortField;
  currentOrder: SortOrder;
}

function StatusFilter({
  currentStatus,
  currentSort,
  currentOrder,
}: StatusFilterProps) {
  const options: Array<{ value: ThemeStatus | ''; label: string }> = [
    { value: '', label: 'すべて' },
    { value: 'active', label: '進行中' },
    { value: 'completed', label: '完了' },
    { value: 'pending', label: '保留' },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-bold leading-[1.7] text-text-body">
        ステータス:
      </span>
      <div className="flex gap-1">
        {options.map(({ value, label }) => {
          const isSelected = (value === '' && !currentStatus) || value === currentStatus;
          const params = new URLSearchParams({ sort: currentSort, order: currentOrder });
          if (value) params.set('status', value);

          return (
            <Link
              key={value || 'all'}
              href={`?${params.toString()}`}
              className={[
                'rounded px-3 py-1 text-sm font-medium transition-colors',
                'focus-visible:outline-2 focus-visible:outline-[#0877d7]',
                isSelected
                  ? 'bg-primary text-white'
                  : 'border border-border text-text-body hover:bg-surface-hover',
              ].join(' ')}
              aria-current={isSelected ? 'true' : undefined}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// メインテーブル
// ----------------------------------------------------------------

interface ThemeTableProps {
  themes: Theme[];
  currentSort: ThemeSortField;
  currentOrder: SortOrder;
  currentStatus?: ThemeStatus;
}

export function ThemeTable({
  themes,
  currentSort,
  currentOrder,
  currentStatus,
}: ThemeTableProps) {
  return (
    <div className="space-y-4">
      <StatusFilter
        currentStatus={currentStatus}
        currentSort={currentSort}
        currentOrder={currentOrder}
      />

      <div className="overflow-x-auto rounded-lg border border-border bg-surface shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border bg-neutral-50">
              <SortableHeader
                label="テーマ名"
                field="name"
                currentSort={currentSort}
                currentOrder={currentOrder}
                currentStatus={currentStatus}
              />
              <th
                scope="col"
                className="px-4 py-3 text-left text-sm font-bold leading-[1.7] text-text-body"
              >
                ステータス
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-sm font-bold leading-[1.7] text-text-body"
              >
                開始日
              </th>
              <SortableHeader
                label="登録日"
                field="created_at"
                currentSort={currentSort}
                currentOrder={currentOrder}
                currentStatus={currentStatus}
              />
              <th scope="col" className="px-4 py-3">
                <span className="sr-only">操作</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {themes.map((theme) => (
              <tr
                key={theme.id}
                className="border-b border-border last:border-0 hover:bg-neutral-50"
              >
                <td className="px-4 py-3 text-sm text-text-body">
                  <Link
                    href={`/themes/${theme.id}`}
                    className="font-medium text-primary hover:underline
                               focus-visible:outline-2 focus-visible:outline-[#0877d7] rounded"
                  >
                    {theme.name}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={theme.status} />
                </td>
                <td className="px-4 py-3 text-sm leading-[1.7] text-text-secondary">
                  {theme.startDate ?? '—'}
                </td>
                <td className="px-4 py-3 text-sm leading-[1.7] text-text-secondary">
                  {formatDate(theme.createdAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/themes/${theme.id}/edit`}
                    className="text-sm font-medium text-primary hover:underline
                               focus-visible:outline-2 focus-visible:outline-[#0877d7] rounded px-1"
                  >
                    編集
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
