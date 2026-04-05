'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { CategoryStat } from '@/lib/comments/stats';

// アクセシブルな色パレット（色盲対応: 青・橙・灰）
const CATEGORY_COLORS: Record<string, string> = {
  improvement: '#0877d7', // primary blue
  bug: '#e05a00',         // accessible orange
  other: '#6b7280',       // neutral gray
};

interface CommentChartProps {
  data: CategoryStat[];
}

export function CommentChart({ data }: CommentChartProps) {
  const [reduceMotion, setReduceMotion] = useState(false);

  // prefers-reduced-motion を尊重する
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <section aria-labelledby="chart-heading" className="space-y-4">
      <h2
        id="chart-heading"
        className="text-lg font-bold leading-[1.6] text-text-body"
      >
        種別ごとのコメント件数
      </h2>

      <div className="rounded-lg border border-border bg-surface p-4 shadow-sm">
        {total === 0 ? (
          <p className="py-8 text-center text-sm text-text-secondary">
            コメントがまだありません
          </p>
        ) : (
          <>
            {/* アクセシブルなデータテーブル（スクリーンリーダー用） */}
            <table className="sr-only" aria-label="種別ごとのコメント件数">
              <thead>
                <tr>
                  <th scope="col">種別</th>
                  <th scope="col">件数</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d) => (
                  <tr key={d.category}>
                    <td>{d.label}</td>
                    <td>{d.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 棒グラフ */}
            <ResponsiveContainer width="100%" height={280} aria-hidden="true">
              <BarChart
                data={data}
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: '#374151' }}
                  axisLine={{ stroke: '#d1d5db' }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: '#374151' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value, _name, props) => [
                    `${value} 件`,
                    (props.payload as CategoryStat).label,
                  ]}
                  contentStyle={{
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ fontSize: '12px', color: '#374151' }}>{value}</span>
                  )}
                />
                <Bar
                  dataKey="count"
                  name="件数"
                  isAnimationActive={!reduceMotion}
                  radius={[4, 4, 0, 0]}
                >
                  {data.map((entry) => (
                    <Cell
                      key={entry.category}
                      fill={CATEGORY_COLORS[entry.category] ?? '#6b7280'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* 凡例補足（色に依存しないテキストラベル） */}
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              {data.map((d) => (
                <div key={d.category} className="flex items-center gap-1.5 text-sm">
                  <span
                    className="inline-block h-3 w-3 rounded-sm"
                    style={{ backgroundColor: CATEGORY_COLORS[d.category] ?? '#6b7280' }}
                    aria-hidden="true"
                  />
                  <span className="text-text-body">
                    {d.label}
                  </span>
                  <span className="font-bold tabular-nums text-text-secondary">
                    ({d.count}件)
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
