'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Comment, CommentCategory } from '@/lib/types';
import { CommentDetailModal } from './CommentDetailModal';

const CATEGORY_LABEL: Record<CommentCategory, string> = {
  improvement: '改善要望',
  bug: '不具合',
  other: 'その他',
};

const CATEGORY_COLOR: Record<CommentCategory, string> = {
  improvement: 'bg-primary/10 text-primary border border-primary/30',
  bug: 'bg-error/10 text-error border border-error/30',
  other: 'bg-neutral-100 text-text-secondary border border-neutral-300',
};

interface CommentTableClientProps {
  comments: Comment[];
  total: number;
  currentPage: number;
  limit: number;
  searchParams: Record<string, string>;
}

export function CommentTableClient({
  comments,
  total,
  currentPage,
  limit,
  searchParams,
}: CommentTableClientProps) {
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  const totalPages = Math.ceil(total / limit);

  const buildPageLink = (page: number) => {
    const params = new URLSearchParams({ ...searchParams, page: String(page) });
    return `/dashboard?${params.toString()}`;
  };

  if (comments.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface py-16 text-center">
        <p className="text-sm leading-[1.7] text-text-secondary">
          該当するコメントが見つかりませんでした
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-border bg-surface shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border bg-neutral-50">
              <th scope="col" className="px-4 py-3 text-left text-sm font-bold leading-[1.7] text-text-body">
                対象画面
              </th>
              <th scope="col" className="px-4 py-3 text-left text-sm font-bold leading-[1.7] text-text-body">
                種別
              </th>
              <th scope="col" className="px-4 py-3 text-left text-sm font-bold leading-[1.7] text-text-body">
                スコア
              </th>
              <th scope="col" className="px-4 py-3 text-left text-sm font-bold leading-[1.7] text-text-body">
                コメント（抜粋）
              </th>
              <th scope="col" className="px-4 py-3 text-left text-sm font-bold leading-[1.7] text-text-body">
                投稿日時
              </th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr
                key={comment.id}
                onClick={() => setSelectedComment(comment)}
                className="border-b border-border last:border-0 cursor-pointer
                           hover:bg-neutral-50 focus-within:bg-neutral-50"
                role="button"
                tabIndex={0}
                aria-label={`コメント詳細を開く: ${comment.body.slice(0, 30)}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedComment(comment);
                  }
                }}
              >
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {comment.pageLabel}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={[
                      'inline-flex items-center rounded px-2 py-0.5 text-xs font-bold leading-[1.0]',
                      CATEGORY_COLOR[comment.category],
                    ].join(' ')}
                  >
                    {CATEGORY_LABEL[comment.category]}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-warning">
                  {comment.score ? '★'.repeat(comment.score) : '—'}
                </td>
                <td className="px-4 py-3 text-sm text-text-body max-w-xs truncate">
                  {comment.body}
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary whitespace-nowrap">
                  {comment.createdAt.toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <nav aria-label="ページネーション" className="flex items-center justify-between">
          <p className="text-sm text-text-secondary">
            全 {total} 件中 {(currentPage - 1) * limit + 1}〜
            {Math.min(currentPage * limit, total)} 件を表示
          </p>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link
                href={buildPageLink(currentPage - 1)}
                className="rounded-[6px] border border-border px-3 py-1.5 text-sm
                           text-text-body hover:bg-surface-hover
                           focus-visible:outline-2 focus-visible:outline-[#0877d7]"
              >
                前のページ
              </Link>
            )}
            <span className="flex items-center px-3 py-1.5 text-sm text-text-secondary">
              {currentPage} / {totalPages}
            </span>
            {currentPage < totalPages && (
              <Link
                href={buildPageLink(currentPage + 1)}
                className="rounded-[6px] border border-border px-3 py-1.5 text-sm
                           text-text-body hover:bg-surface-hover
                           focus-visible:outline-2 focus-visible:outline-[#0877d7]"
              >
                次のページ
              </Link>
            )}
          </div>
        </nav>
      )}

      <CommentDetailModal
        comment={selectedComment}
        onClose={() => setSelectedComment(null)}
      />
    </>
  );
}
