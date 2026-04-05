import { SkeletonCard } from '@/components/feedback/Skeleton';

export default function Loading() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="データを読み込み中">
      {/* ヘッダー骨格 */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-4 w-48 animate-pulse rounded bg-neutral-200" aria-hidden="true" />
          <div className="h-9 w-64 animate-pulse rounded bg-neutral-200" aria-hidden="true" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-20 animate-pulse rounded bg-neutral-200" aria-hidden="true" />
          <div className="h-10 w-20 animate-pulse rounded bg-neutral-200" aria-hidden="true" />
        </div>
      </div>

      {/* 基本情報骨格 */}
      <div className="space-y-2">
        <div className="h-6 w-20 animate-pulse rounded bg-neutral-200" aria-hidden="true" />
        <SkeletonCard />
      </div>

      {/* 関連エンティティ骨格 */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <div className="h-6 w-32 animate-pulse rounded bg-neutral-200" aria-hidden="true" />
          <SkeletonCard />
        </div>
        <div className="space-y-2">
          <div className="h-6 w-24 animate-pulse rounded bg-neutral-200" aria-hidden="true" />
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}
