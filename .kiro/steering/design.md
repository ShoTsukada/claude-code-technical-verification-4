# Design System Steering: デジタル庁デザインシステム (DADS) v2.11.1

## 概要

本プロジェクトは **デジタル庁デザインシステム (DADS) β版 v2.11.1** を採用する。
公式パッケージ `@digital-go-jp/design-tokens@1.1.9` のCSS変数をTailwind CSS v4の `@theme` ブロック経由で利用する。

---

## カラーパレット

### プリミティブカラー（主要）

| トークン | 値 | 用途 |
|---------|-----|------|
| `--color-primitive-blue-900` | `#0017c1` | プライマリブルー（政府標準） |
| `--color-primitive-blue-800` | `#0031d8` | ホバー時 |
| `--color-primitive-blue-100` | `#d9e6ff` | 背景ライト |
| `--color-neutral-solid-gray-900` | `#1a1a1a` | 本文テキスト |
| `--color-neutral-solid-gray-600` | `#666666` | 補助テキスト |
| `--color-neutral-solid-gray-420` | `#949494` | プレースホルダー |
| `--color-neutral-solid-gray-200` | `#cccccc` | ボーダー |
| `--color-neutral-solid-gray-50` | `#f2f2f2` | 背景セカンダリ |
| `--color-neutral-white` | `#ffffff` | 背景プライマリ |

### セマンティックカラー

| トークン | 値 | 用途 |
|---------|-----|------|
| `--color-semantic-success-1` | `#259d63` | 成功（プライマリ） |
| `--color-semantic-success-2` | `#197a4b` | 成功（ダーク） |
| `--color-semantic-error-1` | `#ec0000` | エラー（プライマリ） |
| `--color-semantic-error-2` | `#ce0000` | エラー（ダーク） |
| `--color-semantic-warning-yellow-1` | `#b78f00` | 警告（黄） |
| `--color-semantic-warning-orange-1` | `#fb5b01` | 警告（橙） |

### フォーカスカラー

| トークン | 値 | 用途 |
|---------|-----|------|
| `focus-blue` | `#0877d7` | フォーカスリング（WCAG AA準拠） |
| `focus-yellow` | `#b78f00` | フォーカスリング代替 |

---

## タイポグラフィ

### フォントファミリー

```css
--font-family-sans: 'Noto Sans JP', -apple-system, BlinkMacSystemFont, sans-serif;
--font-family-mono: 'Noto Sans Mono', monospace;
```

### フォントウェイト

- `400`（Regular）: 本文、補助テキスト
- `700`（Bold）: 見出し、ボタン、ラベル

### タイプスケール（主要）

| 用途 | トークン名 | サイズ | ウェイト | 行間 |
|------|-----------|--------|---------|------|
| 画面タイトル (H1) | `std-28B-150` | 28px | Bold | 1.5 |
| セクション見出し (H2) | `std-24B-150` | 24px | Bold | 1.5 |
| サブ見出し (H3) | `std-20B-160` | 20px | Bold | 1.6 |
| 小見出し (H4) | `std-18B-160` | 18px | Bold | 1.6 |
| 本文 | `std-16N-170` | 16px | Regular | 1.7 |
| 小文字本文 | `std-14N-170` | 14px | Regular | 1.7 |
| ボタン/ラベル | `oln-16B-100` | 16px | Bold | 1.0 |
| 小ラベル | `oln-14B-100` | 14px | Bold | 1.0 |

---

## スペーシング・ボーダー・エレベーション

### ボーダーラジアス

| トークン | 値 | 用途 |
|---------|-----|------|
| `--border-radius-4` | 4px | 小要素（バッジ等） |
| `--border-radius-6` | 6px | ボタン、インプット |
| `--border-radius-8` | 8px | カード |
| `--border-radius-12` | 12px | モーダル、大要素 |

### エレベーション（シャドウ）

| トークン | 用途 |
|---------|------|
| `--elevation-1` | カード（静止時） |
| `--elevation-2` | ドロップダウン |
| `--elevation-3` | モーダル |
| `--elevation-4` | ポップオーバー |

---

## ブレークポイント

| 名前 | 値 | 対象 |
|-----|-----|------|
| モバイル（デフォルト） | < 768px | スマートフォン |
| `desktop` | 768px (48em) | タブレット・PC |
| `desktop-admin` | 992px (62em) | 管理画面最適化 |

---

## アクセシビリティ原則

1. **コントラスト**: WCAG 2.1 AA準拠（本文 4.5:1 以上、大文字 3:1 以上）
2. **フォーカスリング**: `focus-blue (#0877d7)` で 3px outline を必ず表示
3. **スキップリンク**: "本文へスキップ" リンクを全ページに配置
4. **フォームラベル**: `<label>` 要素を必ず使用し、プレースホルダーのみに頼らない
5. **エラー通知**: `aria-live="polite"` または `role="alert"` でスクリーンリーダーに通知
6. **キーボードナビゲーション**: 全インタラクティブ要素がタブキーで操作可能

---

## コンポーネント設計原則

- **ボタン**: primary（青塗り）/ secondary（白塗り青ボーダー）/ tertiary（テキスト）/ danger（赤塗り）
- **フォーム**: ラベル上部配置、エラーメッセージはフィールド直下に配置
- **テーブル**: ヘッダーを `<th scope="col">` で定義、ソート可能列は `aria-sort` を付与
- **モーダル**: `role="dialog"` + `aria-modal="true"` + フォーカストラップ + ESCで閉じる
- **トースト通知**: `aria-live="polite"`、3〜5秒で自動消去
- **空状態**: "データがありません" + 登録アクションへのリンクを表示

---

## 採用禁止事項

- `any` 型の使用（TypeScriptルールに従う）
- ハードコードされたカラー値（必ずDADSトークンを使用）
- 絵文字をアイコンとして使用（Heroicons等のSVGアイコンを使用）
- `console.log` の残留（プロジェクトルールに従う）
- プレースホルダーのみのフォームフィールド（アクセシビリティ違反）
