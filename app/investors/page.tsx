import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import { parseInvestorQueryParams } from '@/lib/investors/query-params';
import { getInvestors } from '@/lib/investors/queries';
import { InvestorTable } from '@/components/investors/InvestorTable';
import { CommentSection } from '@/components/comments/CommentSection';
import { buildPageId, buildPageLabel } from '@/lib/comments/page-id';

export const metadata = {
  title: '投資家一覧 | 研究管理プラットフォーム',
};

export default async function InvestorsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const raw = await searchParams;
  const { sort, order, investorType } = parseInvestorQueryParams(raw);
  const investors = await getInvestors(sort, order, investorType);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold leading-[1.5] text-text-body">
          投資家一覧
        </h1>
        <Link
          href="/investors/new"
          className="inline-flex items-center gap-2 rounded-[6px] bg-primary px-5 py-2.5
                     text-sm font-bold text-white hover:bg-primary-hover
                     focus-visible:outline-2 focus-visible:outline-[#0877d7]"
        >
          <PlusIcon className="w-4 h-4" aria-hidden="true" />
          新規登録
        </Link>
      </div>

      {investors.length === 0 ? (
        <EmptyState hasFilter={!!investorType} />
      ) : (
        <InvestorTable
          investors={investors}
          currentSort={sort}
          currentOrder={order}
          currentType={investorType}
        />
      )}

      <CommentSection
        pageId={buildPageId('investor', 'list')}
        pageLabel={buildPageLabel('investor', 'list')}
      />
    </div>
  );
}

function EmptyState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 rounded-lg
                 border border-border bg-surface py-16 text-center"
    >
      <p className="text-base leading-[1.7] text-text-secondary">
        {hasFilter
          ? '該当する投資家が見つかりませんでした'
          : '登録された投資家はありません'}
      </p>
      {!hasFilter && (
        <Link
          href="/investors/new"
          className="inline-flex items-center gap-2 rounded-[6px] bg-primary px-5 py-2.5
                     text-sm font-bold text-white hover:bg-primary-hover
                     focus-visible:outline-2 focus-visible:outline-[#0877d7]"
        >
          <PlusIcon className="w-4 h-4" aria-hidden="true" />
          投資家を登録する
        </Link>
      )}
    </div>
  );
}
