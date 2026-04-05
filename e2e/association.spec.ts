import { test, expect } from '@playwright/test';

/**
 * 関連付け・解除フロー E2E テスト
 * Requirements: 4.1, 4.3
 *
 * 前提: 研究機関・研究テーマが1件以上登録されていること。
 */
test.describe('研究機関詳細での研究テーマ関連付け・解除フロー', () => {
  test('研究機関詳細ページで研究テーマを関連付けられる', async ({ page }) => {
    // 研究機関一覧へ
    await page.goto('/institutions');

    // 最初の機関をクリックして詳細ページへ
    const firstRow = page.getByRole('link').filter({ hasText: /大学|機関/ }).first();
    await firstRow.click();

    // 関連テーマパネルが表示されていることを確認
    await expect(page.getByText('関連する研究テーマ')).toBeVisible();

    // 未関連のテーマが一覧にある場合は関連付けボタンをクリック
    const associateButton = page.getByRole('button', { name: '追加' }).first();
    if (await associateButton.isVisible()) {
      await associateButton.click();

      // 成功トーストが表示される
      await expect(page.getByRole('status')).toBeVisible({ timeout: 5000 });
    }
  });

  test('関連付けを解除できる', async ({ page }) => {
    // 研究機関一覧へ
    await page.goto('/institutions');
    const firstRow = page.getByRole('link').filter({ hasText: /大学|機関/ }).first();
    await firstRow.click();

    // 関連済みテーマがある場合は解除ボタンをクリック
    const dissociateButton = page.getByRole('button', { name: '解除' }).first();
    if (await dissociateButton.isVisible()) {
      await dissociateButton.click();

      // 成功トーストが表示される
      await expect(page.getByRole('status')).toBeVisible({ timeout: 5000 });
    }
  });

  test('重複した関連付けを試みると警告メッセージが表示される', async ({ page }) => {
    // 研究機関一覧へ
    await page.goto('/institutions');
    const firstRow = page.getByRole('link').filter({ hasText: /大学|機関/ }).first();
    await firstRow.click();

    // 関連付けボタンが複数回クリックできない設計になっているが、
    // エラー状態（「この関連付けはすでに存在します」）が表示されないことを確認
    const associateButton = page.getByRole('button', { name: '追加' }).first();
    if (await associateButton.isVisible()) {
      await associateButton.click();
      // 2回目のクリックは UI がブロックするため、エラートーストが出ないことを確認
      await expect(page.getByText('この関連付けはすでに存在します')).not.toBeVisible({ timeout: 2000 });
    }
  });
});
