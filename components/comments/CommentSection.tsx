import { getComments } from '@/lib/comments/queries';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';

interface CommentSectionProps {
  /** 対象画面の識別子（例: "institution/list", "theme/detail/abc"） */
  pageId: string;
  /** 対象画面の表示名（例: "研究機関一覧"） */
  pageLabel: string;
}

export async function CommentSection({ pageId, pageLabel }: CommentSectionProps) {
  const { comments } = await getComments({ pageId });

  return (
    <section aria-labelledby="comments-heading" className="space-y-6">
      <h2
        id="comments-heading"
        className="text-xl font-bold leading-[1.6] text-text-body"
      >
        コメント・レビュー
      </h2>

      {/* コメント一覧 */}
      <div className="rounded-lg border border-border bg-surface px-4">
        <CommentList comments={comments} />
      </div>

      {/* 投稿フォーム */}
      <div className="rounded-lg border border-border bg-surface p-5 shadow-sm">
        <h3 className="mb-4 text-base font-bold leading-[1.6] text-text-body">
          コメントを投稿する
        </h3>
        <CommentForm pageId={pageId} pageLabel={pageLabel} />
      </div>
    </section>
  );
}
