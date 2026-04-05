import { test, expect } from '@playwright/test';

/**
 * 研究機関 CRUD フロー E2E テスト
 * Requirements: 1.1, 1.2, 1.3
 *
 * 前提: テスト用の Supabase 環境が起動しており、
 * BASE_URL (デフォルト: http://localhost:3000) でアプリが応答していること。
 */
test.describe('研究機関の登録・一覧・編集・削除フロー', () => {
  const uniqueSuffix = Date.now();
  const institutionName = `テスト大学_${uniqueSuffix}`;

  test('研究機関を新規登録し、一覧に表示されることを確認する', async ({ page }) => {
    // 研究機関一覧ページへ移動
    await page.goto('/institutions');
    await expect(page).toHaveTitle(/研究機関/);

    // 新規登録ボタンをクリック
    await page.getByRole('link', { name: '新規登録' }).click();
    await expect(page).toHaveURL('/institutions/new');

    // フォームに入力
    await page.getByLabel('機関名').fill(institutionName);
    await page.getByLabel('所在地').fill('東京都千代田区');
    await page.getByLabel('説明').fill('テスト用の研究機関です');

    // 送信
    await page.getByRole('button', { name: '登録' }).click();

    // 一覧ページへリダイレクトされ、登録した機関が表示される
    await expect(page).toHaveURL('/institutions');
    await expect(page.getByText(institutionName)).toBeVisible();
  });

  test('登録した研究機関を編集できる', async ({ page }) => {
    // 一覧から登録済み機関を探して詳細ページへ
    await page.goto('/institutions');
    await page.getByText(institutionName).click();

    // 編集ボタンをクリック
    await page.getByRole('link', { name: '編集' }).click();
    await expect(page.getByLabel('機関名')).toHaveValue(institutionName);

    // 機関名を変更
    const updatedName = `${institutionName}_更新済み`;
    await page.getByLabel('機関名').clear();
    await page.getByLabel('機関名').fill(updatedName);
    await page.getByRole('button', { name: '更新' }).click();

    // 詳細または一覧ページで更新後の名前が表示される
    await expect(page.getByText(updatedName)).toBeVisible();
  });

  test('機関名が空のとき、バリデーションエラーが表示される', async ({ page }) => {
    await page.goto('/institutions/new');

    // 機関名を空のまま送信
    await page.getByRole('button', { name: '登録' }).click();

    // エラーメッセージが表示される（aria-live 領域 or エラーテキスト）
    await expect(page.getByText('機関名は必須です')).toBeVisible();

    // ページ遷移しないことを確認
    await expect(page).toHaveURL('/institutions/new');
  });

  test('登録した研究機関を削除できる', async ({ page }) => {
    // 一覧から登録済み機関を探して詳細ページへ
    await page.goto('/institutions');
    const updatedName = `${institutionName}_更新済み`;
    await page.getByText(updatedName).click();

    // 削除ボタンをクリック（確認ダイアログを承認）
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: '削除' }).click();

    // 一覧ページへ戻り、削除した機関が表示されないことを確認
    await expect(page).toHaveURL('/institutions');
    await expect(page.getByText(updatedName)).not.toBeVisible();
  });
});
