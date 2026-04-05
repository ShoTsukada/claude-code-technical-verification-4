import Link from 'next/link';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import type { Investor, InvestorType } from '@/lib/types';
import type { InvestorSortField, SortOrder } from '@/lib/investors/query-params';

// ----------------------------------------------------------------
// 種別バッジ
// ----------------------------------------------------------------

const TYPE_LABEL: Record<InvestorType, string> = {
  individual: '個人',
  corporate: '法人',
};

const TYPE_COLOR: Record<InvestorType, string> = {
  individual: 'bg-primary/10 text-primary border border-primary/30',
  corporate: 'bg-success/10 text-success-dark border border-success/30',
};

function TypeBadge({ type }: { type: InvestorType }) {
  return (
    <span
      className={[
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-bold leading-[1.0]',
        TYPE_COLOR[type],
      ].join(' ')}
    >
      {TYPE_LABEL[type]}
    </span>
  );
}

// ----------------------------------------------------------------
// 種別フィルター
// ----------------------------------------------------------------

interface TypeFilterProps {
  currentType?: InvestorType;
  currentSort: InvestorSortField;
  currentOrder: SortOrder;
}

function TypeFilter({ currentType, currentSort, currentOrder }: TypeFilterProps) {
  const options: Array<{ value: InvestorType | ''; label: string }> = [
    { value: '', label: 'すべて' },
    { value: 'individual', label: '個人' },
    { value: 'corporate', label: '法人' },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-bold leading-[1.7] text-text-body">種別:</span>
      <div className="flex gap-1">
        {options.map(({ value, label }) => {
          const isSelected =
            (value === '' && !currentType) || value === currentType;
          const params = new URLSearchParams({
            sort: currentSort,
            order: currentOrder,
          });
          if (value) params.set('investorType', value);

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
// ソータブルヘッダー
// ----------------------------------------------------------------

interface SortableHeaderProps {
  label: string;
  field: InvestorSortField;
  currentSort: InvestorSortField;
  currentOrder: SortOrder;
  currentType?: InvestorType;
}

function SortableHeader({
  label,
  field,
  currentSort,
  currentOrder,
  currentType,
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
  if (currentType) params.set('investorType', currentType);

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
// メインテーブル
// ----------------------------------------------------------------

interface InvestorTableProps {
  investors: Investor[];
  currentSort: InvestorSortField;
  currentOrder: SortOrder;
  currentType?: InvestorType;
}

export function InvestorTable({
  investors,
  currentSort,
  currentOrder,
  currentType,
}: InvestorTableProps) {
  return (
    <div className="space-y-4">
      <TypeFilter
        currentType={currentType}
        currentSort={currentSort}
        currentOrder={currentOrder}
      />

      <div className="overflow-x-auto rounded-lg border border-border bg-surface shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border bg-neutral-50">
              <SortableHeader
                label="投資家名"
                field="name"
                currentSort={currentSort}
                currentOrder={currentOrder}
                currentType={currentType}
              />
              <th
                scope="col"
                className="px-4 py-3 text-left text-sm font-bold leading-[1.7] text-text-body"
              >
                種別
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-sm font-bold leading-[1.7] text-text-body"
              >
                投資分野
              </th>
              <SortableHeader
                label="登録日"
                field="created_at"
                currentSort={currentSort}
                currentOrder={currentOrder}
                currentType={currentType}
              />
              <th scope="col" className="px-4 py-3">
                <span className="sr-only">操作</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {investors.map((investor) => (
              <tr
                key={investor.id}
                className="border-b border-border last:border-0 hover:bg-neutral-50"
              >
                <td className="px-4 py-3 text-sm text-text-body">
                  <Link
                    href={`/investors/${investor.id}`}
                    className="font-medium text-primary hover:underline
                               focus-visible:outline-2 focus-visible:outline-[#0877d7] rounded"
                  >
                    {investor.name}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <TypeBadge type={investor.investorType} />
                </td>
                <td className="px-4 py-3 text-sm leading-[1.7] text-text-secondary">
                  {investor.investmentField ?? '—'}
                </td>
                <td className="px-4 py-3 text-sm leading-[1.7] text-text-secondary">
                  {formatDate(investor.createdAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/investors/${investor.id}/edit`}
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
