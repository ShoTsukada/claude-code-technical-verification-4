import { CommentDeleteButton } from './CommentDeleteButton';
import type { Comment, CommentCategory } from '@/lib/types';

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

function ScoreDisplay({ score }: { score: number | null }) {
  if (!score) return null;
  return (
    <span aria-label={`評価: ${score}点`} className="text-warning">
      {'★'.repeat(score)}
      <span className="text-neutral-300" aria-hidden="true">
        {'★'.repeat(5 - score)}
      </span>
    </span>
  );
}

interface CommentListProps {
  comments: Comment[];
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="py-6 text-center text-sm leading-[1.7] text-text-secondary">
        コメントはまだありません
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border" aria-label="コメント一覧">
      {comments.map((comment) => (
        <li key={comment.id} className="py-4 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={[
                  'inline-flex items-center rounded px-2 py-0.5 text-xs font-bold leading-[1.0]',
                  CATEGORY_COLOR[comment.category],
                ].join(' ')}
              >
                {CATEGORY_LABEL[comment.category]}
              </span>
              {comment.score && <ScoreDisplay score={comment.score} />}
              <time
                dateTime={comment.createdAt.toISOString()}
                className="text-xs text-text-secondary"
              >
                {formatDateTime(comment.createdAt)}
              </time>
            </div>
            <CommentDeleteButton id={comment.id} />
          </div>
          <p className="text-sm leading-[1.7] text-text-body whitespace-pre-wrap">
            {comment.body}
          </p>
        </li>
      ))}
    </ul>
  );
}

function formatDateTime(date: Date): string {
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
