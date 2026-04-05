import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PencilIcon } from '@heroicons/react/24/outline';
import {
  getInvestorById,
  getRelatedInstitutions,
  getRelatedThemes,
} from '@/lib/investors/queries';
import { getInstitutions } from '@/lib/institutions/queries';
import { getThemes } from '@/lib/themes/queries';
import { InvestorDeleteButton } from '@/components/investors/InvestorDeleteButton';
import { AssociationPanel } from '@/components/associations/AssociationPanel';
import {
  associateEntities,
  dissociateEntities,
} from '@/lib/associations/actions';
import { CommentSection } from '@/components/comments/CommentSection';
import { buildPageId, buildPageLabel } from '@/lib/comments/page-id';
import type { InvestorType } from '@/lib/types';

const TYPE_LABEL: Record<InvestorType, string> = {
  individual: '個人',
  corporate: '法人',
};

const TYPE_COLOR: Record<InvestorType, string> = {
  individual: 'bg-primary/10 text-primary border border-primary/30',
  corporate: 'bg-success/10 text-success-dark border border-success/30',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const investor = await getInvestorById(id);
  return {
    title: investor
      ? `${investor.name} | 研究管理プラットフォーム`
      : '投資家詳細 | 研究管理プラットフォーム',
  };
}

export default async function InvestorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [
    investor,
    relatedInstitutions,
    relatedThemes,
    allInstitutions,
    allThemes,
  ] = await Promise.all([
    getInvestorById(id),
    getRelatedInstitutions(id),
    getRelatedThemes(id),
    getInstitutions('name', 'asc'),
    getThemes('name', 'asc'),
  ]);

  if (!investor) {
    notFound();
  }

  const associatedInstitutionIds = new Set(relatedInstitutions.map((i) => i.id));
  const availableInstitutions = allInstitutions
    .filter((i) => !associatedInstitutionIds.has(i.id))
    .map((i) => ({ id: i.id, name: i.name }));

  const associatedThemeIds = new Set(relatedThemes.map((t) => t.id));
  const availableThemes = allThemes
    .filter((t) => !associatedThemeIds.has(t.id))
    .map((t) => ({ id: t.id, name: t.name }));

  const associateInstitution = associateEntities.bind(null, 'investor', id, 'institution');
  const dissociateInstitution = dissociateEntities.bind(null, 'investor', id, 'institution');
  const associateTheme = associateEntities.bind(null, 'investor', id, 'theme');
  const dissociateTheme = dissociateEntities.bind(null, 'investor', id, 'theme');

  return (
    <div className="space-y-8">
      {/* ページヘッダー */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <nav aria-label="パンくずリスト" className="mb-2">
            <ol className="flex items-center gap-1 text-sm text-text-secondary">
              <li>
                <Link href="/investors" className="hover:text-primary hover:underline">
                  投資家一覧
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-text-body">
                {investor.name}
              </li>
            </ol>
          </nav>
          <h1 className="text-[28px] font-bold leading-[1.5] text-text-body">
            {investor.name}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href={`/investors/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-[6px] border border-border
                       px-4 py-2 text-sm font-medium text-text-body
                       hover:bg-surface-hover
                       focus-visible:outline-2 focus-visible:outline-[#0877d7]"
          >
            <PencilIcon className="w-4 h-4" aria-hidden="true" />
            編集
          </Link>
          <InvestorDeleteButton id={id} name={investor.name} />
        </div>
      </div>

      {/* 投資家情報 */}
      <section aria-labelledby="info-heading">
        <h2
          id="info-heading"
          className="mb-4 text-xl font-bold leading-[1.6] text-text-body"
        >
          基本情報
        </h2>
        <dl className="rounded-lg border border-border bg-surface divide-y divide-border">
          <div className="flex gap-4 px-4 py-3">
            <dt className="w-32 shrink-0 text-sm font-bold leading-[1.7] text-text-body">
              種別
            </dt>
            <dd className="flex-1 text-sm leading-[1.7]">
              <span
                className={[
                  'inline-flex items-center rounded px-2 py-0.5 text-xs font-bold leading-[1.0]',
                  TYPE_COLOR[investor.investorType],
                ].join(' ')}
              >
                {TYPE_LABEL[investor.investorType]}
              </span>
            </dd>
          </div>
          <InfoRow label="連絡先" value={investor.contact} />
          <InfoRow label="投資分野" value={investor.investmentField} />
          <InfoRow
            label="最終更新日時"
            value={formatDateTime(investor.updatedAt)}
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
            sourceType="investor"
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
            sourceType="investor"
            sourceId={id}
            targetType="theme"
            title="関連する研究テーマ"
            associated={relatedThemes}
            available={availableThemes}
            targetBasePath="/themes"
            onAssociate={associateTheme}
            onDissociate={dissociateTheme}
          />
        </div>
      </section>

      {/* コメント */}
      <CommentSection
        pageId={buildPageId('investor', 'detail', id)}
        pageLabel={buildPageLabel('investor', 'detail')}
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
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex gap-4 px-4 py-3">
      <dt className="w-32 shrink-0 text-sm font-bold leading-[1.7] text-text-body">
        {label}
      </dt>
      <dd className="flex-1 text-sm leading-[1.7] text-text-secondary">
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
