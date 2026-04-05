import { SkeletonTableRows } from '@/components/feedback/Skeleton';

export default function Loading() {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-label="データを読み込み中"
    >
      <div className="flex items-center justify-between">
        <div className="h-9 w-32 animate-pulse rounded bg-neutral-200" aria-hidden="true" />
        <div className="h-10 w-24 animate-pulse rounded bg-neutral-200" aria-hidden="true" />
      </div>

      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 w-16 animate-pulse rounded bg-neutral-200" aria-hidden="true" />
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-surface shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border bg-neutral-50">
              {['投資家名', '種別', '投資分野', '登録日', '操作'].map((col) => (
                <th key={col} scope="col" className="px-4 py-3 text-left" aria-hidden="true">
                  <div className="h-4 w-16 animate-pulse rounded bg-neutral-200" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <SkeletonTableRows rows={5} columns={5} />
          </tbody>
        </table>
      </div>
    </div>
  );
}
