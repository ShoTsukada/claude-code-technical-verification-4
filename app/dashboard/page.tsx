import { parseDashboardParams } from '@/lib/dashboard/query-params';
import { getComments, getCommentStats, getCommentCategoryStats } from '@/lib/comments/queries';
import { DashboardFilter } from '@/components/dashboard/DashboardFilter';
import { CommentTableClient } from '@/components/dashboard/CommentTableClient';
import { StatsSummary } from '@/components/dashboard/StatsSummary';
import { CommentChart } from '@/components/dashboard/CommentChart';
import { ExportButton } from '@/components/dashboard/ExportButton';

export const metadata = {
  title: 'コメント集計ダッシュボード | 研究管理プラットフォーム',
};

const LIMIT = 20;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const raw = await searchParams;
  const params = parseDashboardParams(raw);

  const [{ comments, total }, stats, categoryStats] = await Promise.all([
    getComments({
      pageId: params.pageId,
      category: params.category,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      page: params.page,
      limit: LIMIT,
    }),
    getCommentStats(),
    getCommentCategoryStats(),
  ]);

  const pageIds = stats.map((s) => s.pageId).sort();

  // Client に渡す検索パラメーター（ページネーションリンク生成用）
  const searchParamsRecord: Record<string, string> = {};
  if (params.pageId) searchParamsRecord.pageId = params.pageId;
  if (params.category) searchParamsRecord.category = params.category;
  if (params.dateFrom) searchParamsRecord.dateFrom = params.dateFrom;
  if (params.dateTo) searchParamsRecord.dateTo = params.dateTo;

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <h1 className="text-[28px] font-bold leading-[1.5] text-text-body">
        コメント集計ダッシュボード
      </h1>

      {/* 統計サマリー */}
      <StatsSummary stats={stats} />

      {/* カテゴリーグラフ */}
      <CommentChart data={categoryStats} />

      {/* フィルター */}
      <DashboardFilter currentParams={params} pageIds={pageIds} />

      {/* 件数サマリー + CSVエクスポート */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          {total === 0
            ? '該当するコメントはありません'
            : `全 ${total} 件のコメントが見つかりました`}
        </p>
        <ExportButton
          filters={{
            pageId: params.pageId,
            category: params.category,
            dateFrom: params.dateFrom,
            dateTo: params.dateTo,
          }}
        />
      </div>

      {/* コメントテーブル */}
      <CommentTableClient
        comments={comments}
        total={total}
        currentPage={params.page}
        limit={LIMIT}
        searchParams={searchParamsRecord}
      />
    </div>
  );
}
