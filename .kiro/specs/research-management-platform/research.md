# Research & Design Decisions

---
**Purpose**: DADS（デジタル庁デザインシステム）適用に関する調査結果とアーキテクチャ判断を記録する。

---

## Summary

- **Feature**: `research-management-platform`
- **Discovery Scope**: New Feature（グリーンフィールド）
- **Key Findings**:
  - DADS v2.11.1（β版）は `@digital-go-jp/design-tokens@1.1.9` としてnpm配布されており、CSS変数とJSトークンを提供する
  - Tailwind CSS v4 はプラグインAPIが v3 から大きく変わったため、v3向けの `@digital-go-jp/tailwind-theme-plugin` は使用不可。代わりに CSS変数を直接 `@theme` ブロックにマッピングする
  - DADSのブレークポイントは `desktop: 48em (768px)` と `desktop-admin: 62em (992px)` の2段階で、モバイルファーストを採用する

## Research Log

### DADS パッケージ調査

- **Context**: Next.js 16 + Tailwind CSS v4 環境にDADSを統合する方法を調査
- **Sources Consulted**:
  - `@digital-go-jp/design-tokens@1.1.9` npm パッケージ（dist/tokens.css）
  - `@digital-go-jp/tailwind-theme-plugin@0.3.4` npm パッケージ（dist/index.es.js）
  - DADS公式サイト https://design.digital.go.jp/dads/
- **Findings**:
  - `tokens.css` はプリミティブカラー（blue, red, green等 各13段階）、グレースケール、フォント、ボーダーレイディアス、エレベーションのCSS変数を定義する
  - セマンティックカラー: `--color-semantic-success-1: var(--color-primitive-green-600)` 等
  - フォントスケール命名規則: `{用途}-{サイズ}{ウェイト}-{行間}` (例: `std-16B-170` = 標準16px Bold 行間1.7)
  - `@digital-go-jp/tailwind-theme-plugin` はTailwind v3向け実装（`theme.extend`方式）
- **Implications**: Tailwind v4では `@theme` CSS変数マッピングで同等の効果を実現する

### Tailwind CSS v4 統合方法

- **Context**: Tailwind v4 は CSS-first 設定に移行しており、`tailwind.config.js` が不要になった
- **Findings**:
  - `@import "tailwindcss"` の後に `@theme` ブロックでカスタムトークンを定義する
  - `@theme inline {}` 内でCSS変数を Tailwind ユーティリティにマッピングできる
  - DADSの `tokens.css` を `@import` し、`@theme` でDADS変数を参照する
- **Implications**: `globals.css` で `@import "@digital-go-jp/design-tokens/dist/tokens.css"` を追加し、`@theme` でマッピングを定義する

### DADS カラーシステム

- **Context**: プライマリカラー・セマンティックカラーの確認
- **Findings**:
  - Primary Blue: `--color-primitive-blue-900: #0017c1`（政府標準ブルー）
  - フォーカスカラー: `focus-blue: #0877d7`（アクセシビリティ対応、コントラスト比4.5:1以上）
  - エラー: `error-1: #ec0000`、`error-2: #ce0000`
  - 成功: `success-1: #259d63`、`success-2: #197a4b`
  - 警告（黄）: `warning-yellow-1: #b78f00`
  - 本文テキスト推奨: `solid-gray-900: #1a1a1a`（白背景でコントラスト比 >10:1）
  - プレースホルダー: `solid-gray-420: #949494`（コントラスト比 3.13:1 ≥ 3:1 for large text）
- **Implications**: アクセシビリティ基準（WCAG 2.1 AA）を標準で満たすカラー設計

### DADS タイポグラフィシステム

- **Context**: 日本語対応フォントスタック・タイプスケール
- **Findings**:
  - フォント: `'Noto Sans JP', -apple-system, BlinkMacSystemFont, sans-serif`
  - 等幅: `'Noto Sans Mono', monospace`
  - ウェイト: 400（Regular）と 700（Bold）のみ
  - 日本語向け標準本文: `std-16N-170`（16px / Regular / 行間1.7）
  - 見出しH1相当: `std-28B-150`（28px / Bold / 行間1.5）
  - ボタン/ラベル: `oln-16B-100`（16px / Bold / 行間1）
  - letterSpacing: 見出し0.01em〜0.02em、本文は指定なし（0）
- **Implications**: Noto Sans JPをGoogle Fontsから読み込み、DADSフォントスケールをそのまま採用する

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| DADS CSS変数 + Tailwind v4 @theme | tokens.cssをインポートし@themeでマッピング | 公式トークンとの同期が容易、Tailwindユーティリティとして使用可能 | Tailwind v3向けプラグインは使用不可 | **採用** |
| @digital-go-jp/tailwind-theme-plugin | v3向けプラグイン | 自動マッピング | Tailwind v4非対応 | 不採用 |
| DADSコンポーネントライブラリ直接使用 | @digital-go-jp/design-system | 完成度が高い | β版、React対応状況の不明確さ、Tailwind v4との競合 | 参考実装として活用 |

## Design Decisions

### Decision: Tailwind v4 + DADS CSS変数 統合方式

- **Context**: Tailwind v4 はCSS-first設定に移行しており、v3向けプラグインが利用不可
- **Alternatives Considered**:
  1. `@digital-go-jp/tailwind-theme-plugin` — v3向けのため使用不可
  2. CSS変数を手動定義 — 保守性が低下
  3. `@digital-go-jp/design-tokens` のCSS直接利用 — **採用**
- **Selected Approach**: `globals.css` に `@import "@digital-go-jp/design-tokens/dist/tokens.css"` を追加し、`@theme` ブロックでDADS CSS変数をTailwindユーティリティにマッピングする
- **Rationale**: 公式パッケージのトークンをそのまま利用することで将来のDADSアップデートに追従できる
- **Trade-offs**: 全トークンをマッピングすると `globals.css` が肥大化するため、本プロジェクトで使用するトークンのみをマッピングする
- **Follow-up**: DADSのセマンティックコンポーネント実装を参考に各UIコンポーネントを実装する

### Decision: Next.js App Router + Server Components

- **Context**: Next.js 16 + React 19 環境でのデータフェッチ方式
- **Alternatives Considered**:
  1. 全コンポーネントをClient Components化 — シンプルだがパフォーマンス最適化の機会を失う
  2. Server Components + Server Actions — **採用**
- **Selected Approach**: データ取得はServer Components、フォーム操作はServer Actions、インタラクティブUI（モーダル、フィルター）はClient Components
- **Rationale**: Next.js 16の推奨パターン、初期ロードパフォーマンス向上

### Decision: データベース

- **Context**: エンティティ間の多対多関連付けとコメント集計を効率的に処理するDBを選定
- **Selected Approach**: Supabase（PostgreSQL）— 前プロジェクト（verification-3）での実績と環境変数設定を踏まえ同一スタックを採用
- **Rationale**: RLSによるセキュリティ、リアルタイム機能、集計クエリの効率性

## Risks & Mitigations

- DADS β版の破壊的変更リスク — semver固定（`@digital-go-jp/design-tokens@1.1.9`）でロック
- Noto Sans JPの読み込み遅延 — `next/font/google` でサブセット最適化・preloadを利用
- Tailwind v4 `@theme` のCSS変数参照が全トークンに対して肥大化 — プロジェクト使用トークンのみをマッピング

## References

- [DADS公式サイト](https://design.digital.go.jp/dads/) — β版 v2.11.1
- [@digital-go-jp/design-tokens npm](https://www.npmjs.com/package/@digital-go-jp/design-tokens) — v1.1.9
- [@digital-go-jp/tailwind-theme-plugin npm](https://www.npmjs.com/package/@digital-go-jp/tailwind-theme-plugin) — v0.3.4（参考: v3向け）
- [Tailwind CSS v4 @theme documentation](https://tailwindcss.com/docs/v4-upgrade) — CSS変数マッピング方式
