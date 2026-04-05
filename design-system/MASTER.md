# Design System Master — Research Management Platform

**Base**: デジタル庁デザインシステム (DADS) β版 v2.11.1  
**Package**: `@digital-go-jp/design-tokens@1.1.9`  
**Stack**: Next.js 16 + React 19 + Tailwind CSS v4 + TypeScript

---

## 1. Design Philosophy

本プロジェクトのUIは「信頼性・明快さ・アクセシビリティ」をコアバリューとし、日本の政府標準デザインシステムに準拠する。

- **Simple**: 不要な装飾を排除し、情報構造を優先する
- **Accessible**: WCAG 2.1 AA を全画面で達成する
- **Consistent**: DADSトークンを唯一の真実の源として使用する
- **Predictable**: ユーザーが迷わないナビゲーションと操作フロー

---

## 2. Color System

### Tailwind CSS v4 設定（globals.css）

```css
@import "tailwindcss";
@import "@digital-go-jp/design-tokens/dist/tokens.css";

@theme inline {
  /* Primary */
  --color-primary: var(--color-primitive-blue-900);       /* #0017c1 */
  --color-primary-hover: var(--color-primitive-blue-800); /* #0031d8 */
  --color-primary-light: var(--color-primitive-blue-100); /* #d9e6ff */
  --color-primary-bg: var(--color-primitive-blue-50);     /* #e8f1fe */

  /* Text */
  --color-text-body: var(--color-neutral-solid-gray-900);        /* #1a1a1a */
  --color-text-secondary: var(--color-neutral-solid-gray-600);   /* #666666 */
  --color-text-placeholder: var(--color-neutral-solid-gray-420); /* #949494 */
  --color-text-disabled: var(--color-neutral-solid-gray-400);    /* #999999 */
  --color-text-on-primary: var(--color-neutral-white);           /* #ffffff */
  --color-text-link: var(--color-primitive-blue-900);            /* #0017c1 */

  /* Surface */
  --color-surface: var(--color-neutral-white);                   /* #ffffff */
  --color-surface-secondary: var(--color-neutral-solid-gray-50); /* #f2f2f2 */
  --color-surface-hover: var(--color-neutral-solid-gray-100);    /* #e6e6e6 */

  /* Border */
  --color-border: var(--color-neutral-solid-gray-200);           /* #cccccc */
  --color-border-strong: var(--color-neutral-solid-gray-400);    /* #999999 */
  --color-border-focus: #0877d7;                                 /* focus-blue */

  /* Semantic */
  --color-success: var(--color-semantic-success-1);              /* #259d63 */
  --color-success-dark: var(--color-semantic-success-2);         /* #197a4b */
  --color-error: var(--color-semantic-error-1);                  /* #ec0000 */
  --color-error-dark: var(--color-semantic-error-2);             /* #ce0000 */
  --color-warning: var(--color-semantic-warning-yellow-1);       /* #b78f00 */
  --color-warning-orange: var(--color-semantic-warning-orange-1);/* #fb5b01 */

  /* Font */
  --font-sans: 'Noto Sans JP', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Noto Sans Mono', monospace;

  /* Border Radius */
  --radius-sm: var(--border-radius-4);   /* 0.25rem */
  --radius-md: var(--border-radius-6);   /* 0.375rem */
  --radius-lg: var(--border-radius-8);   /* 0.5rem */
  --radius-xl: var(--border-radius-12);  /* 0.75rem */

  /* Shadow */
  --shadow-card: var(--elevation-1);
  --shadow-dropdown: var(--elevation-2);
  --shadow-modal: var(--elevation-3);
}
```

### セマンティックカラー使用規則

| 用途 | クラス | 禁止事項 |
|-----|--------|---------|
| プライマリアクション | `bg-primary text-text-on-primary` | 任意のhex値 |
| 本文テキスト | `text-text-body` | `text-gray-*` 等 |
| エラー | `text-error border-error` | `text-red-*` 等 |
| 成功 | `text-success` | `text-green-*` 等 |

---

## 3. Typography

### フォント読み込み（layout.tsx）

```typescript
import { Noto_Sans_JP } from 'next/font/google';

const notoSansJP = Noto_Sans_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
  preload: true,
});
```

### タイプスケール適用規則

| HTML要素 | DADSトークン | Tailwindクラス相当 |
|---------|------------|-----------------|
| `<h1>` | `std-28B-150` | `text-[1.75rem] font-bold leading-[1.5] tracking-[0.01em]` |
| `<h2>` | `std-24B-150` | `text-2xl font-bold leading-[1.5] tracking-[0.02em]` |
| `<h3>` | `std-20B-160` | `text-xl font-bold leading-[1.6] tracking-[0.02em]` |
| `<h4>` | `std-18B-160` | `text-lg font-bold leading-[1.6] tracking-[0.02em]` |
| `<p>` | `std-16N-170` | `text-base font-normal leading-[1.7]` |
| ボタン | `oln-16B-100` | `text-base font-bold leading-none tracking-[0.02em]` |
| バッジ | `oln-14B-100` | `text-sm font-bold leading-none tracking-[0.02em]` |

---

## 4. Spacing Scale

8px ベースのスペーシングシステム（Tailwindデフォルト 4px グリッドを使用）

| 用途 | 値 | Tailwindクラス |
|-----|-----|--------------|
| コンポーネント内余白（小） | 8px | `p-2`, `gap-2` |
| コンポーネント内余白（中） | 16px | `p-4`, `gap-4` |
| コンポーネント間余白 | 24px | `mb-6`, `gap-6` |
| セクション間余白 | 32px | `mb-8` |
| ページパディング（モバイル） | 16px | `px-4` |
| ページパディング（デスクトップ） | 24px | `px-6` |
| コンテンツ最大幅 | 1200px | `max-w-[1200px]` |

---

## 5. Component Patterns

### ボタン

```html
<!-- Primary -->
<button class="bg-primary hover:bg-primary-hover text-text-on-primary
               px-5 py-2.5 rounded-md text-base font-bold leading-none
               tracking-[0.02em] focus-visible:outline-4
               focus-visible:outline-[#0877d7] transition-colors">
  登録する
</button>

<!-- Secondary -->
<button class="bg-surface border border-primary text-primary
               hover:bg-primary-bg px-5 py-2.5 rounded-md
               text-base font-bold leading-none tracking-[0.02em]
               focus-visible:outline-4 focus-visible:outline-[#0877d7]">
  キャンセル
</button>

<!-- Danger -->
<button class="bg-error hover:bg-error-dark text-text-on-primary
               px-5 py-2.5 rounded-md text-base font-bold
               focus-visible:outline-4 focus-visible:outline-[#0877d7]">
  削除する
</button>
```

### フォームフィールド

```html
<div class="flex flex-col gap-1">
  <label for="name" class="text-sm font-bold leading-none tracking-[0.02em] text-text-body">
    機関名 <span class="text-error" aria-label="必須">*</span>
  </label>
  <input
    id="name"
    type="text"
    class="border border-border-strong rounded-md px-3 py-2 text-base
           text-text-body placeholder:text-text-placeholder
           focus:outline-2 focus:outline-[#0877d7] focus:border-[#0877d7]"
    placeholder="例：東京大学"
    aria-required="true"
  />
  <p id="name-error" class="text-sm text-error" role="alert">
    機関名を入力してください
  </p>
</div>
```

### カード

```html
<article class="bg-surface border border-border rounded-lg p-4
                shadow-card hover:shadow-dropdown transition-shadow">
  <!-- card content -->
</article>
```

### バッジ（ステータス表示）

```html
<!-- 進行中 -->
<span class="inline-flex items-center px-2 py-0.5 rounded text-sm
             font-bold leading-none bg-primary-bg text-primary">
  進行中
</span>
<!-- 完了 -->
<span class="inline-flex items-center px-2 py-0.5 rounded text-sm
             font-bold leading-none bg-green-50 text-success-dark">
  完了
</span>
```

---

## 6. Layout & Navigation

### サイドバーナビゲーション構造

```
┌──────────────────────────────────────────────────┐
│ Header: ロゴ + アプリ名                           │
├──────────┬───────────────────────────────────────┤
│ Sidebar  │ Main Content Area                     │
│ 240px    │ max-w-[960px] mx-auto px-6 py-8       │
│          │                                       │
│ - 研究機関│ <Breadcrumb />                        │
│ - 研究テーマ│ <PageTitle />                       │
│ - 投資家 │ <ActionArea />                        │
│ - コメント│ <DataTable />                        │
│   集計   │                                       │
└──────────┴───────────────────────────────────────┘
```

### モバイル（< 768px）

- サイドバーはハンバーガーメニューに格納
- ボトムシート等は使用しない（Webアプリのため）

---

## 7. Accessibility Checklist

実装前に全コンポーネントで確認:

- [ ] コントラスト比 ≥ 4.5:1（本文テキスト）、≥ 3:1（大テキスト・UI要素）
- [ ] フォーカスリング: `outline: 3px solid #0877d7; outline-offset: 2px`
- [ ] アイコンのみのボタンに `aria-label` 付与
- [ ] `<img>` に `alt` 属性（装飾画像は `alt=""`）
- [ ] フォームフィールドに `<label for>` 関連付け
- [ ] エラーメッセージに `role="alert"` または `aria-live="polite"`
- [ ] モーダルに `role="dialog"` + `aria-modal="true"` + フォーカストラップ
- [ ] スキップリンク（"本文へスキップ"）を `<body>` 直下に配置
- [ ] テーブルに `<th scope="col/row">` 設定
- [ ] ソートボタンに `aria-sort` 属性

---

## 8. Page-Specific Overrides

ページ固有のデザイン変更は `design-system/pages/[page-name].md` に記録する。

- `design-system/pages/dashboard.md` — コメント集計ダッシュボード（チャート設定等）
