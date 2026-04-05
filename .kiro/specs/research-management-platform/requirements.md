# Requirements Document

## Introduction

本プロジェクトは、研究機関・研究テーマ・投資家の登録および相互関連付けを行うWebアプリケーションである。
各管理画面にはコメント・レビュー機能を設け、ユーザーが改善要望や不具合をフィードバックとして登録できる。
登録されたコメント・レビューは専用の集計画面で一覧・分析できる。

## Requirements

### Requirement 1: 研究機関管理

**Objective:** 管理ユーザーとして、研究機関の情報を登録・編集・削除・一覧表示できるようにしたい。そうすることで、システム上の研究機関データを正確に維持できる。

#### Acceptance Criteria

1. When ユーザーが研究機関の新規登録フォームを送信したとき, the Research Management System shall 入力された機関名・所在地・説明・連絡先情報を保存し、一覧画面へリダイレクトする
2. When ユーザーが研究機関の編集フォームを送信したとき, the Research Management System shall 変更された情報を更新し、更新日時を記録する
3. When ユーザーが研究機関の削除を確定したとき, the Research Management System shall 該当機関を論理削除し、一覧から非表示にする
4. The Research Management System shall 研究機関一覧を名称・登録日でソート可能な形で表示する
5. If 必須項目（機関名）が未入力のまま送信されたとき, the Research Management System shall バリデーションエラーメッセージを該当フィールドの近くに表示する
6. While ユーザーが研究機関詳細ページを閲覧中, the Research Management System shall その機関に関連付けられた研究テーマおよび投資家の一覧を表示する

---

### Requirement 2: 研究テーマ管理

**Objective:** 管理ユーザーとして、研究テーマの情報を登録・編集・削除・一覧表示できるようにしたい。そうすることで、進行中・完了済みの研究活動を体系的に管理できる。

#### Acceptance Criteria

1. When ユーザーが研究テーマの新規登録フォームを送信したとき, the Research Management System shall テーマ名・説明・ステータス（進行中/完了/保留）・開始日を保存する
2. When ユーザーが研究テーマのステータスを変更したとき, the Research Management System shall ステータスと更新日時を更新する
3. When ユーザーが研究テーマの削除を確定したとき, the Research Management System shall 該当テーマを論理削除する
4. The Research Management System shall 研究テーマ一覧をステータス・名称・登録日でフィルタリング・ソート可能な形で表示する
5. If 必須項目（テーマ名）が未入力のまま送信されたとき, the Research Management System shall バリデーションエラーメッセージを表示する
6. While ユーザーが研究テーマ詳細ページを閲覧中, the Research Management System shall そのテーマに関連付けられた研究機関および投資家の一覧を表示する

---

### Requirement 3: 投資家管理

**Objective:** 管理ユーザーとして、投資家の情報を登録・編集・削除・一覧表示できるようにしたい。そうすることで、研究活動を支援する投資家との関係を適切に管理できる。

#### Acceptance Criteria

1. When ユーザーが投資家の新規登録フォームを送信したとき, the Research Management System shall 投資家名・種別（個人/法人）・連絡先・投資分野を保存する
2. When ユーザーが投資家情報を編集し送信したとき, the Research Management System shall 変更内容を更新し、更新日時を記録する
3. When ユーザーが投資家の削除を確定したとき, the Research Management System shall 該当投資家を論理削除する
4. The Research Management System shall 投資家一覧を名称・種別・登録日でソート・フィルタリング可能な形で表示する
5. If 必須項目（投資家名）が未入力のまま送信されたとき, the Research Management System shall バリデーションエラーメッセージを表示する
6. While ユーザーが投資家詳細ページを閲覧中, the Research Management System shall その投資家に関連付けられた研究機関および研究テーマの一覧を表示する

---

### Requirement 4: エンティティ間の関連付け管理

**Objective:** 管理ユーザーとして、研究機関・研究テーマ・投資家の間に多対多の関連付けを作成・解除できるようにしたい。そうすることで、研究エコシステム全体の繋がりを可視化できる。

#### Acceptance Criteria

1. When ユーザーが研究機関詳細画面で研究テーマを関連付ける操作をしたとき, the Research Management System shall 研究機関と研究テーマの関連レコードを作成する
2. When ユーザーが研究機関詳細画面で投資家を関連付ける操作をしたとき, the Research Management System shall 研究機関と投資家の関連レコードを作成する
3. When ユーザーが既存の関連付けを解除したとき, the Research Management System shall 該当の関連レコードを削除する
4. The Research Management System shall 各エンティティ詳細画面に関連付け済みエンティティの一覧と、未関連エンティティを追加するための検索・選択UIを表示する
5. If 同一の関連付けが既に存在する場合, the Research Management System shall 重複登録を防止し、エラーメッセージを表示する

---

### Requirement 5: コメント・レビュー登録機能

**Objective:** 全ユーザーとして、各管理画面（研究機関・研究テーマ・投資家の一覧・詳細画面）に対してコメントおよびレビューを投稿できるようにしたい。そうすることで、画面に対する改善要望や不具合を記録・共有できる。

#### Acceptance Criteria

1. The Research Management System shall 研究機関・研究テーマ・投資家の各一覧画面および詳細画面に、コメント投稿フォームを表示する
2. When ユーザーがコメントフォームを送信したとき, the Research Management System shall コメント本文・種別（改善要望/不具合/その他）・投稿対象画面の識別情報・投稿日時を保存する
3. When ユーザーがレビューを投稿する際に評価スコア（1〜5）を入力したとき, the Research Management System shall コメントと合わせてスコアを保存する
4. If コメント本文が未入力のまま送信されたとき, the Research Management System shall バリデーションエラーメッセージを表示する
5. While ユーザーが各管理画面を閲覧中, the Research Management System shall その画面に紐づくコメント一覧を投稿日時の降順で表示する
6. The Research Management System shall コメント投稿者が自身のコメントを編集・削除できるUIを提供する

---

### Requirement 6: コメント・レビュー集計ダッシュボード

**Objective:** 管理ユーザーとして、全画面から登録されたコメント・レビューを一元的に閲覧・集計できるようにしたい。そうすることで、改善優先度の高い画面や頻出の問題を把握できる。

#### Acceptance Criteria

1. The Research Management System shall コメント・レビュー集計ダッシュボード画面を提供し、全コメントを一覧表示する
2. The Research Management System shall コメントを対象画面・種別（改善要望/不具合/その他）・投稿日付範囲でフィルタリングできる機能を提供する
3. The Research Management System shall 画面別のコメント件数と平均評価スコアを集計した統計サマリーを表示する
4. The Research Management System shall 種別ごとのコメント件数をグラフ（棒グラフまたは円グラフ）で可視化する
5. When ユーザーが集計ダッシュボードで特定コメントをクリックしたとき, the Research Management System shall コメントの詳細（本文・種別・対象画面・投稿日時）をモーダルまたは詳細パネルで表示する
6. The Research Management System shall 集計データをCSV形式でエクスポートする機能を提供する

---

### Requirement 7: UI/UX共通要件

**Objective:** 全ユーザーとして、一貫性のある使いやすいUIで操作できるようにしたい。そうすることで、管理業務を効率的に遂行できる。

#### Acceptance Criteria

1. The Research Management System shall レスポンシブデザインを採用し、デスクトップ・タブレット・スマートフォンで適切に表示する
2. The Research Management System shall ナビゲーションメニューから研究機関・研究テーマ・投資家・コメント集計の各画面に1クリックでアクセスできるようにする
3. When データの作成・更新・削除操作が成功したとき, the Research Management System shall 操作成功のトースト通知またはインラインメッセージを表示する
4. If サーバーエラーまたはネットワークエラーが発生したとき, the Research Management System shall ユーザーフレンドリーなエラーメッセージを表示し、操作のリトライを促す
5. While データの取得または送信処理が進行中, the Research Management System shall ローディングインジケーターを表示する
6. The Research Management System shall 削除操作の前に確認ダイアログを表示し、誤操作を防ぐ
