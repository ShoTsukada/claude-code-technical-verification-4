import Link from 'next/link';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import type { Institution } from '@/lib/types';
import type { SortField, SortOrder } from '@/lib/institutions/sort-params';

interface InstitutionTableProps {
  institutions: Institution[];
  currentSort: SortField;
  currentOrder: SortOrder;
}

export function InstitutionTable({
  institutions,
  currentSort,
  currentOrder,
}: InstitutionTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border bg-neutral-50">
            <SortableHeader
              label="機関名"
              field="name"
              currentSort={currentSort}
              currentOrder={currentOrder}
            />
            <th
              scope="col"
              className="px-4 py-3 text-left text-sm font-bold leading-[1.7] text-text-body"
            >
              所在地
            </th>
            <SortableHeader
              label="登録日"
              field="created_at"
              currentSort={currentSort}
              currentOrder={currentOrder}
            />
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">操作</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {institutions.map((institution) => (
            <tr
              key={institution.id}
              className="border-b border-border last:border-0 hover:bg-neutral-50"
            >
              <td className="px-4 py-3 text-sm text-text-body">
                <Link
                  href={`/institutions/${institution.id}`}
                  className="font-medium text-primary hover:underline
                             focus-visible:outline-2 focus-visible:outline-[#0877d7] rounded"
                >
                  {institution.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-sm leading-[1.7] text-text-secondary">
                {institution.location ?? '—'}
              </td>
              <td className="px-4 py-3 text-sm leading-[1.7] text-text-secondary">
                {formatDate(institution.createdAt)}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/institutions/${institution.id}/edit`}
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
  );
}

interface SortableHeaderProps {
  label: string;
  field: SortField;
  currentSort: SortField;
  currentOrder: SortOrder;
}

function SortableHeader({
  label,
  field,
  currentSort,
  currentOrder,
}: SortableHeaderProps) {
  const isActive = currentSort === field;
  const nextOrder: SortOrder =
    isActive && currentOrder === 'asc' ? 'desc' : 'asc';
  const ariaSortValue = isActive
    ? currentOrder === 'asc'
      ? 'ascending'
      : 'descending'
    : 'none';

  return (
    <th
      scope="col"
      aria-sort={ariaSortValue as 'ascending' | 'descending' | 'none' | 'other'}
      className="px-4 py-3 text-left text-sm font-bold leading-[1.7] text-text-body"
    >
      <Link
        href={`?sort=${field}&order=${nextOrder}`}
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

function formatDate(date: Date): string {
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
