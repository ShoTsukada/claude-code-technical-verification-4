import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PencilIcon } from '@heroicons/react/24/outline';
import {
  getInstitutionById,
  getRelatedThemes,
  getRelatedInvestors,
} from '@/lib/institutions/queries';
import { getThemes } from '@/lib/themes/queries';
import { getInvestors } from '@/lib/investors/queries';
import { InstitutionDeleteButton } from '@/components/institutions/InstitutionDeleteButton';
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
  const institution = await getInstitutionById(id);
  return {
    title: institution
      ? `${institution.name} | 研究管理プラットフォーム`
      : '研究機関詳細 | 研究管理プラットフォーム',
  };
}

export default async function InstitutionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [institution, relatedThemes, relatedInvestors, allThemes, allInvestors] =
    await Promise.all([
      getInstitutionById(id),
      getRelatedThemes(id),
      getRelatedInvestors(id),
      getThemes('name', 'asc'),
      getInvestors('name', 'asc'),
    ]);

  if (!institution) {
    notFound();
  }

  const associatedThemeIds = new Set(relatedThemes.map((t) => t.id));
  const availableThemes = allThemes
    .filter((t) => !associatedThemeIds.has(t.id))
    .map((t) => ({ id: t.id, name: t.name }));

  const associatedInvestorIds = new Set(relatedInvestors.map((i) => i.id));
  const availableInvestors = allInvestors
    .filter((i) => !associatedInvestorIds.has(i.id))
    .map((i) => ({ id: i.id, name: i.name }));

  const associateTheme = associateEntities.bind(null, 'institution', id, 'theme');
  const dissociateTheme = dissociateEntities.bind(null, 'institution', id, 'theme');
  const associateInvestor = associateEntities.bind(null, 'institution', id, 'investor');
  const dissociateInvestor = dissociateEntities.bind(null, 'institution', id, 'investor');

  return (
    <div className="space-y-8">
      {/* ページヘッダー */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <nav aria-label="パンくずリスト" className="mb-2">
            <ol className="flex items-center gap-1 text-sm text-text-secondary">
              <li>
                <Link href="/institutions" className="hover:text-primary hover:underline">
                  研究機関一覧
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-text-body">
                {institution.name}
              </li>
            </ol>
          </nav>
          <h1 className="text-[28px] font-bold leading-[1.5] text-text-body">
            {institution.name}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href={`/institutions/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-[6px] border border-border
                       px-4 py-2 text-sm font-medium text-text-body
                       hover:bg-surface-hover
                       focus-visible:outline-2 focus-visible:outline-[#0877d7]"
          >
            <PencilIcon className="w-4 h-4" aria-hidden="true" />
            編集
          </Link>
          <InstitutionDeleteButton id={id} name={institution.name} />
        </div>
      </div>

      {/* 機関情報 */}
      <section aria-labelledby="info-heading">
        <h2
          id="info-heading"
          className="mb-4 text-xl font-bold leading-[1.6] text-text-body"
        >
          基本情報
        </h2>
        <dl className="rounded-lg border border-border bg-surface divide-y divide-border">
          <InfoRow label="所在地" value={institution.location} />
          <InfoRow label="説明" value={institution.description} multiline />
          <InfoRow label="連絡先" value={institution.contact} />
          <InfoRow
            label="最終更新日時"
            value={formatDateTime(institution.updatedAt)}
          />
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
            sourceType="institution"
            sourceId={id}
            targetType="theme"
            title="関連する研究テーマ"
            associated={relatedThemes}
            available={availableThemes}
            targetBasePath="/themes"
            onAssociate={associateTheme}
            onDissociate={dissociateTheme}
          />
          <AssociationPanel
            sourceType="institution"
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
        pageId={buildPageId('institution', 'detail', id)}
        pageLabel={buildPageLabel('institution', 'detail')}
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
