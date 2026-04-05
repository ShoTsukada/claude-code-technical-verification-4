import { SkeletonTableRows } from '@/components/feedback/Skeleton';

export default function Loading() {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-label="データを読み込み中"
    >
      {/* ページヘッダー骨格 */}
      <div className="flex items-center justify-between">
        <div
          className="h-9 w-40 animate-pulse rounded bg-neutral-200"
          aria-hidden="true"
        />
        <div
          className="h-10 w-24 animate-pulse rounded bg-neutral-200"
          aria-hidden="true"
        />
      </div>

      {/* テーブル骨格 */}
      <div className="overflow-x-auto rounded-lg border border-border bg-surface shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border bg-neutral-50">
              {['機関名', '所在地', '登録日', '操作'].map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="px-4 py-3 text-left"
                  aria-hidden="true"
                >
                  <div className="h-4 w-16 animate-pulse rounded bg-neutral-200" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <SkeletonTableRows rows={5} columns={4} />
          </tbody>
        </table>
      </div>
    </div>
  );
}
