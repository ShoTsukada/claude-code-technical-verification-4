import { notFound } from 'next/navigation';
import Link from 'next/link';
import { InstitutionForm } from '@/components/institutions/InstitutionForm';
import { updateInstitution } from '@/lib/institutions/actions';
import { getInstitutionById } from '@/lib/institutions/queries';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const institution = await getInstitutionById(id);
  return {
    title: institution
      ? `${institution.name} 編集 | 研究管理プラットフォーム`
      : '研究機関編集 | 研究管理プラットフォーム',
  };
}

export default async function EditInstitutionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const institution = await getInstitutionById(id);

  if (!institution) {
    notFound();
  }

  // updateInstitution(id, prevState, formData) の id を bind で束縛する
  const boundUpdate = updateInstitution.bind(null, id);

  return (
    <div className="space-y-6">
      {/* パンくず + ヘッダー */}
      <div>
        <nav aria-label="パンくずリスト" className="mb-2">
          <ol className="flex items-center gap-1 text-sm text-text-secondary">
            <li>
              <Link
                href="/institutions"
                className="hover:text-primary hover:underline"
              >
                研究機関一覧
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/institutions/${id}`}
                className="hover:text-primary hover:underline"
              >
                {institution.name}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-text-body">
              編集
            </li>
          </ol>
        </nav>
        <h1 className="text-[28px] font-bold leading-[1.5] text-text-body">
          研究機関 編集
        </h1>
      </div>

      {/* フォームカード */}
      <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
        <InstitutionForm
          action={boundUpdate}
          defaultValues={{
            name: institution.name,
            location: institution.location,
            description: institution.description,
            contact: institution.contact,
          }}
          submitLabel="更新する"
          redirectTo={`/institutions/${id}`}
          successMessage="研究機関を更新しました"
        />
      </div>
    </div>
  );
}
