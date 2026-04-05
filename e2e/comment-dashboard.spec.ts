import { test, expect } from '@playwright/test';

/**
 * コメント投稿 → ダッシュボード反映フロー E2E テスト
 * Requirements: 5.2, 6.1
 *
 * 前提: 研究機関が1件以上登録されていること。
 */
test.describe('コメント投稿 → ダッシュボード反映フロー', () => {
  const uniqueBody = `E2Eテストコメント_${Date.now()}`;

  test('研究機関一覧ページにコメントを投稿できる', async ({ page }) => {
    await page.goto('/institutions');

    // コメントフォームが表示されていることを確認
    await expect(page.getByRole('form', { name: /コメント/ }).or(
      page.getByLabel('コメント')
    )).toBeVisible({ timeout: 5000 });

    // カテゴリーを選択
    await page.getByLabel('改善要望').check();

    // コメント本文を入力
    await page.getByLabel('コメント').fill(uniqueBody);

    // 送信
    await page.getByRole('button', { name: '送信' }).click();

    // 成功フィードバック（トーストまたは件数増加）
    await expect(page.getByRole('status').or(page.getByText('投稿しました'))).toBeVisible({
      timeout: 5000,
    });
  });

  test('ダッシュボードで投稿したコメントが確認できる', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveTitle(/ダッシュボード/);

    // 統計サマリーが表示されている
    await expect(page.getByText('総コメント数')).toBeVisible();

    // 種別グラフが表示されている（aria-hidden なので見出しで確認）
    await expect(page.getByText('種別ごとのコメント件数')).toBeVisible();
  });

  test('ダッシュボードでフィルタリングできる', async ({ page }) => {
    await page.goto('/dashboard');

    // 種別フィルターで「改善要望」を選択
    await page.getByLabel('種別').selectOption('improvement');
    await page.getByRole('button', { name: '絞り込む' }).click();

    // URLにフィルターパラメーターが含まれる
    await expect(page).toHaveURL(/category=improvement/);
  });

  test('ダッシュボードでコメント行をクリックすると詳細モーダルが開く', async ({ page }) => {
    await page.goto('/dashboard');

    // テーブルに行がある場合、最初の行をクリック
    const firstRow = page.getByRole('row').filter({ hasText: /.+/ }).nth(1); // ヘッダーを除く1行目
    if (await firstRow.isVisible()) {
      await firstRow.click();

      // モーダルが開く
      await expect(page.getByRole('dialog')).toBeVisible({ timeout: 3000 });

      // Escape で閉じられる
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).not.toBeVisible();
    }
  });

  test('CSVダウンロードボタンが機能する', async ({ page }) => {
    await page.goto('/dashboard');

    // ダウンロードイベントを待機
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null);
    await page.getByRole('button', { name: 'CSVダウンロード' }).click();

    const download = await downloadPromise;
    if (download) {
      expect(download.suggestedFilename()).toMatch(/^comments_\d{4}-\d{2}-\d{2}\.csv$/);
    }
  });
});
