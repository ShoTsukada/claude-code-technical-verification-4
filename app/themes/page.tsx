import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import { parseThemeQueryParams } from '@/lib/themes/query-params';
import { getThemes } from '@/lib/themes/queries';
import { ThemeTable } from '@/components/themes/ThemeTable';
import { CommentSection } from '@/components/comments/CommentSection';
import { buildPageId, buildPageLabel } from '@/lib/comments/page-id';

export const metadata = {
  title: '研究テーマ一覧 | 研究管理プラットフォーム',
};

export default async function ThemesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const raw = await searchParams;
  const { sort, order, status } = parseThemeQueryParams(raw);
  const themes = await getThemes(sort, order, status);

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold leading-[1.5] text-text-body">
          研究テーマ一覧
        </h1>
        <Link
          href="/themes/new"
          className="inline-flex items-center gap-2 rounded-[6px] bg-primary px-5 py-2.5
                     text-sm font-bold text-white hover:bg-primary-hover
                     focus-visible:outline-2 focus-visible:outline-[#0877d7]"
        >
          <PlusIcon className="w-4 h-4" aria-hidden="true" />
          新規登録
        </Link>
      </div>

      {/* コンテンツ */}
      {themes.length === 0 ? (
        <EmptyState hasFilter={!!status} />
      ) : (
        <ThemeTable
          themes={themes}
          currentSort={sort}
          currentOrder={order}
          currentStatus={status}
        />
      )}

      <CommentSection
        pageId={buildPageId('theme', 'list')}
        pageLabel={buildPageLabel('theme', 'list')}
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
          ? '該当する研究テーマが見つかりませんでした'
          : '登録された研究テーマはありません'}
      </p>
      {!hasFilter && (
        <Link
          href="/themes/new"
          className="inline-flex items-center gap-2 rounded-[6px] bg-primary px-5 py-2.5
                     text-sm font-bold text-white hover:bg-primary-hover
                     focus-visible:outline-2 focus-visible:outline-[#0877d7]"
        >
          <PlusIcon className="w-4 h-4" aria-hidden="true" />
          研究テーマを登録する
        </Link>
      )}
    </div>
  );
}
