import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PencilIcon } from '@heroicons/react/24/outline';
import {
  getThemeById,
  getRelatedInstitutions,
  getRelatedInvestors,
} from '@/lib/themes/queries';
import { getInstitutions } from '@/lib/institutions/queries';
import { getInvestors } from '@/lib/investors/queries';
import { STATUS_LABELS } from '@/lib/themes/status-utils';
import { ThemeStatusButton } from '@/components/themes/ThemeStatusButton';
import { ThemeDeleteButton } from '@/components/themes/ThemeDeleteButton';
import { AssociationPanel } from '@/components/associations/AssociationPanel';
import {
  associateEntities,
  dissociateEntities,
} from '@/lib/associations/actions';
import { CommentSection } from '@/components/comments/CommentSection';
import { buildPageId, buildPageLabel } from '@/lib/comments/page-id';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const theme = await getThemeById(id);
  return {
    title: theme
      ? `${theme.name} | 研究管理プラットフォーム`
      : '研究テーマ詳細 | 研究管理プラットフォーム',
  };
}

export default async function ThemeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [
    theme,
    relatedInstitutions,
    relatedInvestors,
    allInstitutions,
    allInvestors,
  ] = await Promise.all([
    getThemeById(id),
    getRelatedInstitutions(id),
    getRelatedInvestors(id),
    getInstitutions('name', 'asc'),
    getInvestors('name', 'asc'),
  ]);

  if (!theme) {
    notFound();
  }

  const associatedInstitutionIds = new Set(relatedInstitutions.map((i) => i.id));
  const availableInstitutions = allInstitutions
    .filter((i) => !associatedInstitutionIds.has(i.id))
    .map((i) => ({ id: i.id, name: i.name }));

  const associatedInvestorIds = new Set(relatedInvestors.map((i) => i.id));
  const availableInvestors = allInvestors
    .filter((i) => !associatedInvestorIds.has(i.id))
    .map((i) => ({ id: i.id, name: i.name }));

  const associateInstitution = associateEntities.bind(null, 'theme', id, 'institution');
  const dissociateInstitution = dissociateEntities.bind(null, 'theme', id, 'institution');
  const associateInvestor = associateEntities.bind(null, 'theme', id, 'investor');
  const dissociateInvestor = dissociateEntities.bind(null, 'theme', id, 'investor');

  return (
    <div className="space-y-8">
      {/* ページヘッダー */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <nav aria-label="パンくずリスト" className="mb-2">
            <ol className="flex items-center gap-1 text-sm text-text-secondary">
              <li>
                <Link
                  href="/themes"
                  className="hover:text-primary hover:underline"
                >
                  研究テーマ一覧
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-text-body">
                {theme.name}
              </li>
            </ol>
          </nav>
          <h1 className="text-[28px] font-bold leading-[1.5] text-text-body">
            {theme.name}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href={`/themes/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-[6px] border border-border
                       px-4 py-2 text-sm font-medium text-text-body
                       hover:bg-surface-hover
                       focus-visible:outline-2 focus-visible:outline-[#0877d7]"
          >
            <PencilIcon className="w-4 h-4" aria-hidden="true" />
            編集
          </Link>
          <ThemeDeleteButton id={id} name={theme.name} />
        </div>
      </div>

      {/* ステータス変更 */}
      <section aria-labelledby="status-heading">
        <h2
          id="status-heading"
          className="mb-3 text-lg font-bold leading-[1.6] text-text-body"
        >
          ステータス管理
        </h2>
        <div className="rounded-lg border border-border bg-surface p-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-text-body">現在:</span>
            <span className="rounded bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
              {STATUS_LABELS[theme.status]}
            </span>
          </div>
          <ThemeStatusButton id={id} currentStatus={theme.status} />
        </div>
      </section>

      {/* テーマ情報 */}
      <section aria-labelledby="info-heading">
        <h2
          id="info-heading"
          className="mb-4 text-xl font-bold leading-[1.6] text-text-body"
        >
          基本情報
        </h2>
        <dl className="rounded-lg border border-border bg-surface divide-y divide-border">
          <InfoRow label="説明" value={theme.description} multiline />
          <InfoRow label="開始日" value={theme.startDate} />
          <InfoRow label="最終更新日時" value={formatDateTime(theme.updatedAt)} />
        </dl>
      </section>

      {/* 関連エンティティ */}
      <section aria-labelledby="associations-heading">
        <h2
          id="associations-heading"
          className="mb-4 text-xl font-bold leading-[1.6] text-text-body"
        >
          関連付け管理
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <AssociationPanel
            sourceType="theme"
            sourceId={id}
            targetType="institution"
            title="関連する研究機関"
            associated={relatedInstitutions}
            available={availableInstitutions}
            targetBasePath="/institutions"
            onAssociate={associateInstitution}
            onDissociate={dissociateInstitution}
          />
          <AssociationPanel
            sourceType="theme"
            sourceId={id}
            targetType="investor"
            title="関連する投資家"
            associated={relatedInvestors}
            available={availableInvestors}
            targetBasePath="/investors"
            onAssociate={associateInvestor}
            onDissociate={dissociateInvestor}
          />
        </div>
      </section>

      {/* コメント */}
      <CommentSection
        pageId={buildPageId('theme', 'detail', id)}
        pageLabel={buildPageLabel('theme', 'detail')}
      />
    </div>
  );
}

// ----------------------------------------------------------------
// 補助コンポーネント
// ----------------------------------------------------------------

interface InfoRowProps {
  label: string;
  value: string | null | undefined;
  multiline?: boolean;
}

function InfoRow({ label, value, multiline = false }: InfoRowProps) {
  return (
    <div className="flex gap-4 px-4 py-3">
      <dt className="w-32 shrink-0 text-sm font-bold leading-[1.7] text-text-body">
        {label}
      </dt>
      <dd
        className={[
          'flex-1 text-sm leading-[1.7] text-text-secondary',
          multiline ? 'whitespace-pre-wrap' : '',
        ].join(' ')}
      >
        {value ?? '—'}
      </dd>
    </div>
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
