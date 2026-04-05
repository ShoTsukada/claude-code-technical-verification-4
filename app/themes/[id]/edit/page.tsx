import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ThemeForm } from '@/components/themes/ThemeForm';
import { updateTheme } from '@/lib/themes/actions';
import { getThemeById } from '@/lib/themes/queries';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const theme = await getThemeById(id);
  return {
    title: theme
      ? `${theme.name} 編集 | 研究管理プラットフォーム`
      : '研究テーマ編集 | 研究管理プラットフォーム',
  };
}

export default async function EditThemePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const theme = await getThemeById(id);

  if (!theme) {
    notFound();
  }

  const boundUpdate = updateTheme.bind(null, id);

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
            <li>
              <Link
                href={`/themes/${id}`}
                className="hover:text-primary hover:underline"
              >
                {theme.name}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-text-body">編集</li>
          </ol>
        </nav>
        <h1 className="text-[28px] font-bold leading-[1.5] text-text-body">
          研究テーマ 編集
        </h1>
      </div>

      <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
        <ThemeForm
          action={boundUpdate}
          defaultValues={{
            name: theme.name,
            description: theme.description,
            status: theme.status,
            startDate: theme.startDate,
          }}
          submitLabel="更新する"
          redirectTo={`/themes/${id}`}
          successMessage="研究テーマを更新しました"
        />
      </div>
    </div>
  );
}
