import { SkeletonTableRows } from '@/components/feedback/Skeleton';

export default function Loading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="データを読み込み中">
      <div className="h-9 w-64 animate-pulse rounded bg-neutral-200" aria-hidden="true" />

      {/* フィルター骨格 */}
      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="flex flex-wrap gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1">
              <div className="h-4 w-16 animate-pulse rounded bg-neutral-200" aria-hidden="true" />
              <div className="h-9 w-40 animate-pulse rounded bg-neutral-200" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>

      {/* テーブル骨格 */}
      <div className="overflow-x-auto rounded-lg border border-border bg-surface shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border bg-neutral-50">
              {['対象画面', '種別', 'スコア', 'コメント', '投稿日時'].map((col) => (
                <th key={col} className="px-4 py-3 text-left" aria-hidden="true">
                  <div className="h-4 w-16 animate-pulse rounded bg-neutral-200" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <SkeletonTableRows rows={10} columns={5} />
          </tbody>
        </table>
      </div>
    </div>
  );
}
