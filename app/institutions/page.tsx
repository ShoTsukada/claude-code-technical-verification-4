import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import { parseSortParams } from '@/lib/institutions/sort-params';
import { getInstitutions } from '@/lib/institutions/queries';
import { InstitutionTable } from '@/components/institutions/InstitutionTable';
import { CommentSection } from '@/components/comments/CommentSection';
import { buildPageId, buildPageLabel } from '@/lib/comments/page-id';

export const metadata = {
  title: '研究機関一覧 | 研究管理プラットフォーム',
};

export default async function InstitutionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const raw = await searchParams;
  const { sort, order } = parseSortParams(raw);
  const institutions = await getInstitutions(sort, order);

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold leading-[1.5] text-text-body">
          研究機関一覧
        </h1>
        <Link
          href="/institutions/new"
          className="inline-flex items-center gap-2 rounded-[6px] bg-primary px-5 py-2.5
                     text-sm font-bold text-white hover:bg-primary-hover
                     focus-visible:outline-2 focus-visible:outline-[#0877d7]"
        >
          <PlusIcon className="w-4 h-4" aria-hidden="true" />
          新規登録
        </Link>
      </div>

      {/* コンテンツ */}
      {institutions.length === 0 ? (
        <EmptyState />
      ) : (
        <InstitutionTable
          institutions={institutions}
          currentSort={sort}
          currentOrder={order}
        />
      )}

      <CommentSection
        pageId={buildPageId('institution', 'list')}
        pageLabel={buildPageLabel('institution', 'list')}
      />
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 rounded-lg
                 border border-border bg-surface py-16 text-center"
    >
      <p className="text-base leading-[1.7] text-text-secondary">
        登録された研究機関はありません
      </p>
      <Link
        href="/institutions/new"
        className="inline-flex items-center gap-2 rounded-[6px] bg-primary px-5 py-2.5
                   text-sm font-bold text-white hover:bg-primary-hover
                   focus-visible:outline-2 focus-visible:outline-[#0877d7]"
      >
        <PlusIcon className="w-4 h-4" aria-hidden="true" />
        研究機関を登録する
      </Link>
    </div>
  );
}
