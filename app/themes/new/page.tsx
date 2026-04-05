import Link from 'next/link';
import { ThemeForm } from '@/components/themes/ThemeForm';
import { createTheme } from '@/lib/themes/actions';

export const metadata = {
  title: '研究テーマ 新規登録 | 研究管理プラットフォーム',
};

export default function NewThemePage() {
  return (
    <div className="space-y-6">
      <div>
        <nav aria-label="パンくずリスト" className="mb-2">
          <ol className="flex items-center gap-1 text-sm text-text-secondary">
            <li>
              <Link href="/themes" className="hover:text-primary hover:underline">
                研究テーマ一覧
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-text-body">新規登録</li>
          </ol>
        </nav>
        <h1 className="text-[28px] font-bold leading-[1.5] text-text-body">
          研究テーマ 新規登録
        </h1>
      </div>

      <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
        <ThemeForm
          action={createTheme}
          submitLabel="登録する"
          successMessage="研究テーマを登録しました"
        />
      </div>
    </div>
  );
}
