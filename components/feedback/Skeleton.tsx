// Skeleton コンポーネント — ローディング状態プレースホルダー
// aria-hidden="true" で補助技術からは隠す（aria-busy をラッパーで使用すること）

interface SkeletonProps {
  className?: string;
}

function SkeletonBase({ className = '' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={['animate-pulse rounded bg-neutral-200', className].join(' ')}
    />
  );
}

// ----------------------------------------------------------------
// カードスケルトン
// ----------------------------------------------------------------
export function SkeletonCard() {
  return (
    <div aria-hidden="true" className="rounded-lg border border-border p-4 space-y-3">
      <SkeletonBase className="h-5 w-3/5" />
      <SkeletonBase className="h-4 w-full" />
      <SkeletonBase className="h-4 w-4/5" />
    </div>
  );
}

// ----------------------------------------------------------------
// テーブル行スケルトン
// ----------------------------------------------------------------
interface SkeletonTableRowsProps {
  rows?: number;
  columns?: number;
}

export function SkeletonTableRows({ rows = 5, columns = 4 }: SkeletonTableRowsProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <tr key={rowIdx} aria-hidden="true">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <td key={colIdx} className="px-4 py-3">
              <SkeletonBase className="h-4 w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ----------------------------------------------------------------
// フォームスケルトン
// ----------------------------------------------------------------
interface SkeletonFormProps {
  fields?: number;
}

export function SkeletonForm({ fields = 4 }: SkeletonFormProps) {
  return (
    <div aria-hidden="true" className="space-y-5">
      {Array.from({ length: fields }).map((_, idx) => (
        <div key={idx} className="space-y-1">
          <SkeletonBase className="h-4 w-24" />
          <SkeletonBase className="h-10 w-full" />
        </div>
      ))}
      <SkeletonBase className="h-10 w-32" />
    </div>
  );
}
