import Link from 'next/link';
import { InvestorForm } from '@/components/investors/InvestorForm';
import { createInvestor } from '@/lib/investors/actions';

export const metadata = {
  title: '投資家 新規登録 | 研究管理プラットフォーム',
};

export default function NewInvestorPage() {
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
            <li aria-current="page" className="text-text-body">
              新規登録
            </li>
          </ol>
        </nav>
        <h1 className="text-[28px] font-bold leading-[1.5] text-text-body">
          投資家 新規登録
        </h1>
      </div>

      {/* フォームカード */}
      <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
        <InvestorForm
          action={createInvestor}
          submitLabel="登録する"
          successMessage="投資家を登録しました"
        />
      </div>
    </div>
  );
}
