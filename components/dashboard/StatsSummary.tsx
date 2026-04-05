interface PageStat {
  pageId: string;
  pageLabel: string;
  count: number;
  avgScore: number | null;
}

interface StatsSummaryProps {
  stats: PageStat[];
}

export function StatsSummary({ stats }: StatsSummaryProps) {
  const total = stats.reduce((sum, s) => sum + s.count, 0);
  const allScores = stats
    .filter((s) => s.avgScore !== null)
    .map((s) => s.avgScore as number);
  const overallAvg =
    allScores.length > 0
      ? allScores.reduce((a, b) => a + b, 0) / allScores.length
      : null;

  return (
    <section aria-labelledby="stats-heading" className="space-y-4">
      <h2
        id="stats-heading"
        className="text-lg font-bold leading-[1.6] text-text-body"
      >
        全体サマリー
      </h2>

      {/* 全体集計カード */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="総コメント数"
          value={String(total)}
          unit="件"
        />
        <StatCard
          label="平均スコア"
          value={overallAvg !== null ? overallAvg.toFixed(1) : '—'}
          unit={overallAvg !== null ? '/ 5.0' : ''}
        />
        <StatCard
          label="対象画面数"
          value={String(stats.length)}
          unit="画面"
        />
        <StatCard
          label="スコア付き"
          value={String(allScores.length)}
          unit="画面"
        />
      </div>

      {/* 画面別テーブル */}
      {stats.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border bg-surface shadow-sm">
          <table className="w-full border-collapse">
            <caption className="sr-only">画面別コメント件数・平均スコア</caption>
            <thead>
              <tr className="border-b border-border bg-neutral-50">
                <th scope="col" className="px-4 py-3 text-left text-sm font-bold text-text-body">
                  対象画面
                </th>
                <th scope="col" className="px-4 py-3 text-right text-sm font-bold text-text-body">
                  件数
                </th>
                <th scope="col" className="px-4 py-3 text-right text-sm font-bold text-text-body">
                  平均スコア
                </th>
              </tr>
            </thead>
            <tbody>
              {stats
                .sort((a, b) => b.count - a.count)
                .map((s) => (
                  <tr
                    key={s.pageId}
                    className="border-b border-border last:border-0 hover:bg-neutral-50"
                  >
                    <td className="px-4 py-2 text-sm text-text-body">
                      <div>{s.pageLabel}</div>
                      <div className="text-xs text-text-secondary">{s.pageId}</div>
                    </td>
                    <td className="px-4 py-2 text-right text-sm text-text-body tabular-nums">
                      {s.count}
                    </td>
                    <td className="px-4 py-2 text-right text-sm text-text-secondary tabular-nums">
                      {s.avgScore !== null ? (
                        <span className="text-warning">
                          {'★'.repeat(Math.round(s.avgScore))}
                          <span className="text-neutral-300">
                            {'★'.repeat(5 - Math.round(s.avgScore))}
                          </span>
                          <span className="ml-1 text-text-secondary">
                            ({s.avgScore.toFixed(1)})
                          </span>
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function StatCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-sm">
      <p className="text-xs font-medium leading-[1.7] text-text-secondary">{label}</p>
      <p className="mt-1 text-2xl font-bold leading-tight text-text-body tabular-nums">
        {value}
        {unit && (
          <span className="ml-1 text-sm font-normal text-text-secondary">{unit}</span>
        )}
      </p>
    </div>
  );
}
