import { notFound } from 'next/navigation';
import Link from 'next/link';
import { InvestorForm } from '@/components/investors/InvestorForm';
import { updateInvestor } from '@/lib/investors/actions';
import { getInvestorById } from '@/lib/investors/queries';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const investor = await getInvestorById(id);
  return {
    title: investor
      ? `${investor.name} 編集 | 研究管理プラットフォーム`
      : '投資家編集 | 研究管理プラットフォーム',
  };
}

export default async function EditInvestorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const investor = await getInvestorById(id);

  if (!investor) {
    notFound();
  }

  // updateInvestor(id, prevState, formData) の id を bind で束縛する
  const boundUpdate = updateInvestor.bind(null, id);

  return (
    <div className="space-y-6">
      {/* パンくず + ヘッダー */}
      <div>
        <nav aria-label="パンくずリスト" className="mb-2">
          <ol className="flex items-center gap-1 text-sm text-text-secondary">
            <li>
              <Link
                href="/investors"
                className="hover:text-primary hover:underline"
              >
                投資家一覧
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/investors/${id}`}
                className="hover:text-primary hover:underline"
              >
                {investor.name}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-text-body">
              編集
            </li>
          </ol>
        </nav>
        <h1 className="text-[28px] font-bold leading-[1.5] text-text-body">
          投資家 編集
        </h1>
      </div>

      {/* フォームカード */}
      <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
        <InvestorForm
          action={boundUpdate}
          defaultValues={{
            name: investor.name,
            investorType: investor.investorType,
            contact: investor.contact,
            investmentField: investor.investmentField,
          }}
          submitLabel="更新する"
          redirectTo={`/investors/${id}`}
          successMessage="投資家を更新しました"
        />
      </div>
    </div>
  );
}
