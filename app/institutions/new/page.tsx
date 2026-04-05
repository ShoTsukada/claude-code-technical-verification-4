import Link from 'next/link';
import { InstitutionForm } from '@/components/institutions/InstitutionForm';
import { createInstitution } from '@/lib/institutions/actions';

export const metadata = {
  title: '研究機関 新規登録 | 研究管理プラットフォーム',
};

export default function NewInstitutionPage() {
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
            <li aria-current="page" className="text-text-body">
              新規登録
            </li>
          </ol>
        </nav>
        <h1 className="text-[28px] font-bold leading-[1.5] text-text-body">
          研究機関 新規登録
        </h1>
      </div>

      {/* フォームカード */}
      <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
        <InstitutionForm
          action={createInstitution}
          submitLabel="登録する"
          successMessage="研究機関を登録しました"
        />
      </div>
    </div>
  );
}
